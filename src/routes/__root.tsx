import { AuthContextType } from '@/auth/models/AuthContextType';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<{ auth: AuthContextType }>()({
  component: () => <Outlet />,
});
