import React from 'react';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Main from './Main'

const theme = createMuiTheme({ });

const App = () => (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Main />
    </MuiThemeProvider>
)

export default App
