import { InputGroup, Input, Button, Text, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindDoctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/doctors?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box p={4} textAlign="center" mt="4rem" maxW="1340px" mx="auto">
      <Text fontSize={["lg", "x-large", "xx-large"]} fontWeight="bold" mb={[2, 4, 6, 8]}>
        Not finding the right doctor?
      </Text>
      <InputGroup size={['sm', 'md']}>
        <Input
          focusBorderColor="#f9f9f9f9"
          borderRadius="0"
          placeholder="Search for doctors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleSearch} colorScheme="teal" ml={2}>
          Search
        </Button>
      </InputGroup>
    </Box>
  );
}

export default FindDoctors;
