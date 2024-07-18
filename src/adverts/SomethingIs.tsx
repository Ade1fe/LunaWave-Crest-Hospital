import { Box, Button, Text } from "@chakra-ui/react";

const SomethingIs = () => {
  return (
    <Box p={4} className='texts' mt='2rem' textAlign='center' mx='auto' borderRadius="md" boxShadow="sm" fontSize={['xs', 'sm']} w='fit-content'>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Notice an Issue?</Text>
      <Text mb={4}>If you notice any problems with our services or find incorrect information, please let us know so we can address it promptly.</Text>
      <Button colorScheme="red" variant="solid">Report Issue</Button>
    </Box>
  );
}

export default SomethingIs;
