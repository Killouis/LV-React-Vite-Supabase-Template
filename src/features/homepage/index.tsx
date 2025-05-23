import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const spin = keyframes`from {transform: rotate(0deg)}; to {transform: rotate(360deg)}`;
  const spinAnimation = `${spin} infinite 2s linear`;

  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: () => fetch('/api/data').then((res) => res.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data) console.log(data);

  return (
    <Center h="100vh" w="100vw">
      <VStack gap={16}>
        <Box animation={spinAnimation}>
          <Image src="/src/assets/react.svg" />
        </Box>
        <Heading fontSize="4xl">{t('WELCOME_TITLE')}</Heading>
        <VStack gap={2}>
          <Text fontSize="xl">{t('WELCOME_DESCRIPTION_1')}</Text>
          <Text fontSize="xl">{t('WELCOME_DESCRIPTION_2')}</Text>
          <Text fontSize="xl">{t('WELCOME_DESCRIPTION_3')}</Text>
        </VStack>
        <VStack gap={8}>
          <Text fontStyle="oblique" fontSize="xl">
            {t('WELCOME_DESCRIPTION_4')}
          </Text>
          <Button onClick={() => navigate({ to: '/login' })}>Login</Button>
        </VStack>
      </VStack>
    </Center>
  );
};
