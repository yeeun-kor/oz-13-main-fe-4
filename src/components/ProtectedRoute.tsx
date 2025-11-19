import { useAuthStore } from '../features/auth/store/authStore';
import NeedLoginPage from '../pages/NeedLoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const access = useAuthStore((state) => state.access);

  if (!access) {
    return <NeedLoginPage />;
  }

  return <>{children}</>; // eslint-disable-line react/jsx-no-useless-fragment
};

export default ProtectedRoute;
