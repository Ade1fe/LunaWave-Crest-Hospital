import { Text, Box } from '@chakra-ui/react';
import { BackPage } from '../Components';


const DontReport = () => {
  return (
    <Box className='texts' p={4}  boxShadow="sm" bg="#f9f9f9" display='flex' alignItems='center' justifyContent='center'>
              <BackPage />
      <Text fontSize="xs" fontWeight="medium" color="gray.700" textAlign="center">
        We are in the process of updating the details for this healthcare provider. The information provided may not be completely accurate at this time. If you notice any discrepancies, please report them so we can correct them promptly.
      </Text>
    </Box>
  );
}

export default DontReport;
