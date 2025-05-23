import { Role } from '@/auth/models/Role';
import { LoginPage } from '@/features/login';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context, location }) => {
    if (context.auth.isAuthenticated) {
      const redirectTo = context.auth.hasRole(Role.ADMIN)
        ? '/admin'
        : '/dashboard';
      throw redirect({
        to: redirectTo,
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: LoginPage,
});
