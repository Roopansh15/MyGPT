import { Navigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <Loader label="Loading MyGPT" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

