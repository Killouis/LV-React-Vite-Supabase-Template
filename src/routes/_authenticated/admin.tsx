import { Role } from '@/auth/models/Role';
import { AdminPage } from '@/features/admin';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.hasRole(Role.ADMIN)) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminPage,
});
