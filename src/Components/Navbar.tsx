import { useEffect, useState } from "react";
import { Box, Flex, Text, Link as ChakraLink, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure, Menu, MenuButton, MenuList, MenuItem, Avatar } from "@chakra-ui/react";
import { RiMenu2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Box bg="#541e1b" px={4} py={2}>
      <Flex justify="space-between" align="center" maxW='1340px' mx='auto'>
        <ChakraLink as={Link} to="/" _hover={{ textDecoration: "none" }}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            LunaWave Crest Hospital
          </Text>
        </ChakraLink>
        <Flex display={{ base: "none", md: "flex" }} align="center">
          <ChakraLink as={Link} to="/about" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            About Us
          </ChakraLink>
          <ChakraLink as={Link} to="/services" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            Services
          </ChakraLink>
          <ChakraLink as={Link} to="/contact" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
            Contact
          </ChakraLink>
          {user ? (
            <Menu>
              <MenuButton as={Avatar}  size='xs' ml={4} cursor="pointer" />
              <MenuList>
                <MenuItem as={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <ChakraLink as={Link} to="/login" ml={4} color="white" _hover={{ textDecoration: "underline" }}>
              Login
            </ChakraLink>
          )}
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
            <ChakraLink as={Link} to="/contact" onClick={onClose} display="block" mb={2}>
              Contact
            </ChakraLink>
            {user ? (
              <>
                <ChakraLink as={Link} to="/profile" onClick={onClose} display="block" mb={2}>
                  Profile
                </ChakraLink>
                <ChakraLink onClick={handleLogout} display="block">
                  Logout
                </ChakraLink>
              </>
            ) : (
              <ChakraLink as={Link} to="/login" onClick={onClose} display="block">
                Login
              </ChakraLink>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
