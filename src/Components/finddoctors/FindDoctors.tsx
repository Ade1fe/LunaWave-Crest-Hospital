import { InputGroup, Input, Button, Text, Box } from '@chakra-ui/react';

const FindDoctors = () => {
  return (
    <Box p={4} textAlign='center' mt='4rem' maxW='1340px' mx='auto'>
      <Text fontSize={["lg", 'x-large', 'xx-large']} fontWeight="bold" mb={[2,4,6,8]}>Not finding the right doctor?</Text>
      <InputGroup size={['sm', 'md']}>
        <Input focusBorderColor='#f9f9f9f9' borderRadius='0' placeholder='Search for doctors' />  
          <Button ml='0.4px' borderRadius='0' colorScheme="teal">Search</Button>
      </InputGroup>
    </Box>
  );
}

export default FindDoctors;
