import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import Form from './Form' // Adjust the import path as necessary

const SomethingIs = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p={4} className='texts' mt='2rem' textAlign='center' mx='auto' borderRadius="md" boxShadow="sm" fontSize={['xs', 'sm']} w='fit-content'>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Notice an Issue?</Text>
      <Text mb={4}>If you notice any problems with our services or find incorrect information, please let us know so we can address it promptly.</Text>
      <Button colorScheme="red" variant="solid" onClick={onOpen}>Report Issue</Button>

      <Form isOpen={isOpen} onClose={onClose} onOpen={function (): void {
        throw new Error("Function not implemented.");
      } } />
    </Box>
  );
}

export default SomethingIs;
