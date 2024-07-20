import { Box, Text, SimpleGrid, Stack, Input, Textarea, Button, FormControl, FormLabel, FormErrorMessage, useToast, Icon, Link } from "@chakra-ui/react";
import React, { useState } from 'react';
import {  FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import MainLayout from "../Layout/MainLayout";

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate a network request
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent.",
        description: "Thank you for contacting us. We will get back to you shortly.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 2000);
  };

  return (
   <MainLayout >
     <Box p={8} maxW="7xl" mx="auto" mt='0rem' className="texts">
      <Text as="h1" fontWeight='900' fontSize="2xl" textAlign="center" mb={[3,4,5,6,7]}>
        Contact Us
      </Text>
      <Text fontSize="lg" textAlign="center" mb={8}>
        If you have any questions, concerns, or feedback, please don't hesitate to contact us. Our team is here to help you.
      </Text>
      <SimpleGrid columns={[1, null, 2]} spacing={10} mb={10} mt='2rem'>
        <Stack spacing={4}>
          <Text fontWeight='900' fontSize="lg">
            Our Location
          </Text>
          <Text fontSize="md">
            Lunawave Hospital
          </Text>
          <Text fontSize="md">
            123 Health St, Wellness City, HC 12345
          </Text>
          <Text fontSize="md">
            Phone: (123) 456-7890
          </Text>
          <Text fontSize="md">
            Email: info@lunawavehospital.com
          </Text>
        </Stack>
        <Stack spacing={4}>
          <Text fontWeight='900' fontSize="lg">
            Contact Form
          </Text>
          <Box as="form" onSubmit={handleSubmit}>
            <FormControl isRequired mb={4}>
              <FormLabel>Your Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormErrorMessage>Email is required.</FormErrorMessage>
            </FormControl>
            <FormControl isRequired mb={4}>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
              />
            </FormControl>
            <Button
              bg="orange.800"
              color='white'
              _hover={{bg: "orange.900"}}
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting"
              width="full"
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </SimpleGrid>
      <Stack spacing={4} textAlign="center" mt='4rem'>
        <Text fontWeight='900' fontSize="2xl">
          Follow Us
        </Text>
        <Text fontSize="md">
          Stay connected with us through social media for the latest updates and health tips.
        </Text>
       
               <Box>
          <Link href="https://www.linkedin.com" isExternal mx={2}>
            <Icon as={FaLinkedin} boxSize={[5,6,7]} color='blue.500'/>
          </Link>
         
          <Link href="https://www.instagram.com" isExternal mx={2}>
            <Icon as={FaInstagram} boxSize={[5,6,7]} color='red.500'/>
          </Link>

          <Link href="https://www.twitter.com" isExternal mx={2}>
            <Icon as={FaTwitter} boxSize={[5,6,7]} color='blue.900'/>
          </Link>
        </Box>

      </Stack>
    </Box>
   </MainLayout>
  );
}

export default ContactUs;
