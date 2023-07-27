import { createTheme } from '@mui/material';
import { cyan, red } from '@mui/material/colors';

export const LightTheme = createTheme({
  palette: {
    primary: {
      main: red[700],
      dark: red[800],
      light: red[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: '#ffffff',
    },
    background: {
      paper: '#ffffff',
      default: '#f7f6f3',
    }
  }
});
