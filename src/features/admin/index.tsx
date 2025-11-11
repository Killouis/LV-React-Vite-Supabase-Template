import { useAuth } from '@/auth/AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import {
  Button,
  Center,
  Heading,
  Presence,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

interface Item {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  const {
    data: items,
    isLoading,
    error,
  } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('items').select();
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <Center h="100vh" w="100vw">
      <VStack gap={8}>
        <Heading>Admin Page</Heading>
        <Text>Welcome to the admin page, {user?.name}</Text>
        <Button colorPalette="red" onClick={handleLogout}>
          Logout
        </Button>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}
        <Presence present={!isLoading && !error}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Created At</Table.ColumnHeader>
                <Table.ColumnHeader>Updated At</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>
                  <Table.Cell>{item.created_at}</Table.Cell>
                  <Table.Cell>{item.updated_at}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Presence>
      </VStack>
    </Center>
  );
};
