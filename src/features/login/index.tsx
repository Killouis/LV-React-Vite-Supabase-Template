import { useAuth } from '@/auth/AuthProvider';
import { Role } from '@/auth/models/Role';
import { Button, Center, Heading, Input, VStack } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const auth = useAuth();

  const handleLogin = async () => {
    const newUser = await auth.login(email);
    if (newUser?.roles?.includes(Role.ADMIN)) {
      navigate({ to: '/admin' });
    } else if (newUser?.roles?.includes(Role.USER)) {
      navigate({ to: '/dashboard' });
    } else {
      alert('You do not have permission to access this application');
    }
  };

  return (
    <Center h="100vh" w="100vw">
      <VStack gap={8}>
        <Heading>Login Page</Heading>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleLogin();
            }
          }}
        />
        <Button onClick={async () => await handleLogin()}>Login</Button>
      </VStack>
    </Center>
  );
};
