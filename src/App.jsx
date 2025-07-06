import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import PageRoutes from "./routes";
import { theme } from "./utils/constant";
import { AuthProvider } from "./contextApi/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PageRoutes />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
