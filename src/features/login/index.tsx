import { useAuth } from '@/auth/AuthProvider';
import { Role } from '@/auth/models/Role';
import { toaster } from '@/components/ui/toaster';
import {
  Button,
  Center,
  Heading,
  Input,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      const user = await auth.login(email, password);
      if (user) {
        toaster.success({
          title: 'Login Successful',
          duration: 3000,
          closable: true,
        });
        if (user.roles?.includes(Role.ADMIN)) {
          navigate({ to: '/admin' });
        } else if (user.roles?.includes(Role.USER)) {
          navigate({ to: '/dashboard' });
        } else {
          // Default navigation if roles are not as expected
          navigate({ to: '/dashboard' });
        }
      } else {
        toaster.error({
          title: 'Login Failed',
          description: 'Please check your email and password.',
          duration: 3000,
          closable: true,
        });
      }
    } catch (error: any) {
      console.error('Login page error during login:', error);
      toaster.error({
        title: 'Login Error',
        description:
          error.message || 'An unexpected error occurred during login.',
        duration: 3000,
        closable: true,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await auth.signUp(email, password);
      if (user) {
        // Supabase might require email confirmation.
        // The onAuthStateChange listener in AuthProvider should handle user state.
        toaster.success({
          title: 'Sign Up Successful!',
          description:
            'Please check your email for a confirmation link if required. You can then login.',
          duration: 3000,
          closable: true,
        });
        // Optionally, clear fields or navigate. For now, user can attempt login.
        // setEmail(''); // Consider if this is good UX
        // setPassword('');
      } else {
        toaster.error({
          title: 'Sign Up Failed',
          description:
            'Could not create your account. The email might be in use or password too weak.',
          duration: 3000,
          closable: true,
        });
      }
    } catch (error: any) {
      console.error('Login page error during sign up:', error);
      toaster.error({
        title: 'Sign Up Error',
        description:
          error.message || 'An unexpected error occurred during sign up.',
        duration: 3000,
        closable: true,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithGoogle();
      // OAuth flow will redirect. Navigation is handled by onAuthStateChange in AuthProvider.
      // A toast here might not be visible if redirect is immediate.
    } catch (error: any) {
      console.error('Login page error during Google sign in:', error);
      toaster.error({
        title: 'Google Sign-In Error',
        description: error.message || 'Could not sign in with Google.',
        duration: 3000,
        closable: true,
      });
    }
  };

  const onEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (email && password) {
        await handleLogin();
      }
    }
  };

  return (
    <Center h="100vh" w="100vw" bg="gray.50">
      <VStack
        gap={5}
        p={10}
        boxShadow="xl"
        bg="white"
        borderRadius="lg"
        w={{ base: '90%', md: '400px' }}
      >
        <Heading as="h1" size="xl" color="teal.600" mb={2}>
          Welcome
        </Heading>
        <Text color="gray.500" mb={6}>
          Access your account or create a new one.
        </Text>
        <Input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onEnterPress}
          size="lg"
          borderColor="teal.500"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onEnterPress}
          size="lg"
          borderColor="teal.500"
        />
        <VStack gap={3} w="full" mt={4}>
          <Button
            colorScheme="teal"
            onClick={handleLogin}
            w="full"
            size="lg"
            disabled={!email || !password}
          >
            Login
          </Button>
          <Button
            variant="outline"
            colorScheme="teal"
            onClick={handleSignUp}
            w="full"
            size="lg"
            disabled={!email || !password}
          >
            Sign Up
          </Button>
        </VStack>
        <HStack w="full" alignItems="center" my={4}>
          <hr style={{ flexGrow: 1, borderBottom: '1px solid #E2E8F0' }} />
          <Text px={3} fontSize="sm" color="gray.400" fontWeight="medium">
            OR
          </Text>
          <hr style={{ flexGrow: 1, borderBottom: '1px solid #E2E8F0' }} />
        </HStack>
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={handleGoogleSignIn}
          w="full"
          size="lg"
        >
          <HStack gap={2}>
            <FaGoogle />
            <Text>Sign in with Google</Text>
          </HStack>
        </Button>
      </VStack>
    </Center>
  );
};
