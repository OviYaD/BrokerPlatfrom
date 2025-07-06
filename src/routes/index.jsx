import { BrowserRouter, Route, Routes } from "react-router-dom";
import BrokerPlatForm from "../pages";
import LoginPage from "../pages/login";
import DashBoard from "../pages/dashboard";
import ProtectedRoutes from "./ProtectedRoutes";

const PageRoutes = () => {
  return (
    <>
      <BrowserRouter basename="/BrokerPlatfrom">
        <Routes>
          <Route path="/" element={<BrokerPlatForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default PageRoutes;
