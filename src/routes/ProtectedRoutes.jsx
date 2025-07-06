import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contextApi/AuthContext";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();

  // Show loading while initializing from localStorage
  if (!isInitialized || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      oviya{isAuthenticated ? "Authenticated" : "Not Authenticated"}
      <Outlet />
    </>
  );
};

export default ProtectedRoutes;
