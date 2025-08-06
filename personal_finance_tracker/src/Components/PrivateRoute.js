import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.warn("Please Login Again", {
      position: "top-center",
      autoClose: 3000
    });

    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
