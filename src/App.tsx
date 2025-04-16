import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { UserProvider } from './context/UserContext';
import TableSection from './components/TableSection';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <h1>User Database</h1>
          <TableSection />
        </Container>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
