import { Box, Flex, Text, Link as ChakraLink, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure } from "@chakra-ui/react";
import { RiMenu2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";


const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <Box bg="#541e1b" px={4} py={2}>
      <Flex justify="space-between" align="center" maxW='1340px' mx='auto'>
        <ChakraLink as={Link} to="/" _hover={{ textDecoration: "none" }}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            LunaWave Crest Hospital
          </Text>
        </ChakraLink>
        <Flex display={{ base: "none", md: "flex" }}>
          <ChakraLink as={Link} to="/about" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            About Us
          </ChakraLink>
          <ChakraLink as={Link} to="/services" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            Services
          </ChakraLink>
          <ChakraLink as={Link} to="/contact" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            Contact
          </ChakraLink>
        </Flex>
        <IconButton
          icon={<RiMenu2Fill />}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          aria-label="Open Menu"
          color="white"
          bg="#541e1b"
          _hover={{ bg: "teal.600" }}
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>LunaWave Crest Hospital</DrawerHeader>
          <DrawerBody>
            <ChakraLink as={Link} to="/about" onClick={onClose} display="block" mb={2}>
              About Us
            </ChakraLink>
            <ChakraLink as={Link} to="/services" onClick={onClose} display="block" mb={2}>
              Services
            </ChakraLink>
            <ChakraLink as={Link} to="/contact" onClick={onClose} display="block">
              Contact
            </ChakraLink>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
