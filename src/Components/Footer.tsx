import { Box, Text, Link, Flex } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box bg="#f9f9f9" p={4} mt={['9rem', "10rem", '11rem', '12rem', '13rem']}>
      <Flex direction="column" alignItems="center">
   
        <Flex mt={2} fontSize={['sm','md']}>
          <Link as={RouterLink} to="/about" mr={4} color="gray.600" _hover={{ color: '#541e1b', textDecoration: 'underline' }}>
            About Us
          </Link>
          <Link as={RouterLink} to="/contact" mr={4} color="gray.600" _hover={{ color: '#541e1b', textDecoration: 'underline' }}>
            Contact Us
          </Link>
          <Link as={RouterLink} to="/doctors" color="gray.600" _hover={{ color: '#541e1b', textDecoration: 'underline' }}>
            Find Doctors
          </Link>
        </Flex>
        <Text mt='0.2rem' fontSize={['xs', "sm"]}>&copy; 2024 LunaWave Crest Hospital. All rights reserved.</Text>
      </Flex>
    </Box>
  );
}

export default Footer;
