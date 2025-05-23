import { useAuth } from '@/auth/AuthProvider';
import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <Center h="100vh" w="100vw">
      <VStack gap={8}>
        <Heading>Dashboard</Heading>
        <Text>Welcome to the dashboard, {user?.name}</Text>
        <Button colorPalette="red" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>
    </Center>
  );
};
