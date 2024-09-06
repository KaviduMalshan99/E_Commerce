import { Navigate, Outlet } from "react-router-dom";
import { USER_ROLES } from "./constants/roles";
import { useAuthStore } from "./store/useAuthStore";

const CheckLoginStatus = () => {
  const user = useAuthStore.getState().user;

  if (!user) {
    return <Outlet />;
  }

  const permissionLevel = user.role;

  if (permissionLevel === USER_ROLES.CUSTOMER) {
    return <Navigate to="/" />;
  } else if (permissionLevel === USER_ROLES.ADMIN) {
    return <Navigate to="/" />;
  } else {
    return <Outlet />;
  }
};

export default CheckLoginStatus;
