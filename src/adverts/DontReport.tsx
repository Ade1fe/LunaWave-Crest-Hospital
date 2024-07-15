import { Text, Box } from '@chakra-ui/react';


const DontReport = () => {
  return (
    <Box p={4} pos='sticky' top='0px' zIndex='' boxShadow="sm" bg="#f9f9f9">
      <Text fontSize="xs" fontWeight="medium" color="gray.700" textAlign="center">
        We are in the process of updating the details for this healthcare provider. The information provided may not be completely accurate at this time. If you notice any discrepancies, please report them so we can correct them promptly.
      </Text>
    </Box>
  );
}

export default DontReport;
