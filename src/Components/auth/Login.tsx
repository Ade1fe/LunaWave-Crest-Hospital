import { Box, Button, Input, FormControl, FormLabel, Heading, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your login logic here
    console.log('Login with:', { email, password });
    navigate('/'); // Navigate to home page or dashboard after login
  };

  return (
 <MainLayout >
     <Box maxW="md" mx="auto" mt="8" p="8" borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Heading as="h1" mb="6" textAlign="center">
        Login
      </Heading>
      <VStack spacing="4">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button colorScheme="teal" width="full" onClick={handleLogin}>
          Login
        </Button>
        <Link to="/Signup">Have an account? sign up </Link>
      </VStack>
    </Box>
 </MainLayout>
  );
};

export default Login;
