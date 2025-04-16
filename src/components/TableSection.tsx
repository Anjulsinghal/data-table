import React, { useState, useEffect } from "react";
import { User } from "../types/index";
import { useUsers } from "../context/UserContext";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, TextField, Box, Typography,  Chip, Fade, Grow, IconButton, Tooltip, CircularProgress, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, styled } from "@mui/material/styles";
import { motion } from "framer-motion";

type Order = "asc" | "desc";

const AnimatedTableRow = motion(TableRow);

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, ${
    theme.palette.background.paper
  } 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

const TableSection: React.FC = () => {

  // define states...
  const { users, loading, error } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // handle search and sorting by effect...
  useEffect(() => {
    let result = [...users];

    // search filter...
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // sort filter...
    result.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchQuery, order, orderBy]);

  // handle sorting...
  const handleRequestSort = (property: keyof User) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // handle pagination...
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // handle pagination...
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // handle search...
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // handle error and loading....
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  
  // pagination.....
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // color setters for status...
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    // main table section...
    <Fade in={true} timeout={1000}>
      <StyledPaper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, }} >
          <Typography variant="h4" component="h2"
            sx={{ fontWeight: "bold", color: "primary.main", textShadow: "2px 2px 4px rgba(0,0,0,0.1)", }} >
            Users Directory
            <Grow in={true} timeout={1000}>
              <Chip sx={{ marginLeft: 1 }} label={`${filteredUsers.length} Users`} color="primary" variant="outlined" />
            </Grow>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3, mr: 3 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />, }}
              sx={{
                width: 400,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "primary.light",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.dark",
                  },
                },
              }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }} aria-label="user table">
            <TableHead>
              <TableRow>
                {["Name", "Email", "Role", "Status"].map((header) => (
                  <TableCell key={header}>
                    <TableSortLabel
                      active={orderBy === header.toLowerCase()}
                      direction={ orderBy === header.toLowerCase() ? order : "asc" }
                      onClick={() => handleRequestSort(header.toLowerCase() as keyof User) } >
                      <Typography variant="subtitle2" fontWeight="bold" color="primary" >
                        {header}
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <AnimatedTableRow
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        transition: "background-color 0.3s ease-in-out",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      />
                    </TableCell>
                  </AnimatedTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No users found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, }}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
            results
          </Typography>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </StyledPaper>
    </Fade>
  );
};

export default TableSection;