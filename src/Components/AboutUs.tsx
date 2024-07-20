import { Box, Heading, Text, Image, SimpleGrid, Stack, Divider } from "@chakra-ui/react";
import React from 'react';
import MainLayout from "../Layout/MainLayout";

const AboutUs = () => {
  return (
  <MainLayout>
      <Box p={8} maxW="7xl" mx="auto" className="texts">
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        About LunaWave Crest Hospital
      </Heading>
      <Box mb={8}>
        <Image src="https://via.placeholder.com/1200x400" alt="LunaWave Crest Hospital" borderRadius="md" />
      </Box>
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        <Stack spacing={4}>
          <Heading as="h2" size="lg">
            Our Mission
          </Heading>
          <Text fontSize="md">
            At LunaWave Crest Hospital, our mission is to provide exceptional healthcare services with compassion, integrity, and respect for all our patients. We strive to be a leader in innovative medical practices and treatments, ensuring the highest standards of patient care.
          </Text>
        </Stack>
        <Stack spacing={4}>
          <Heading as="h2" size="lg">
            Our Vision
          </Heading>
          <Text fontSize="md">
            LunaWave Crest Hospital aims to be the preferred healthcare provider in the region, recognized for our state-of-the-art facilities, dedicated staff, and commitment to improving the health and well-being of the communities we serve.
          </Text>
        </Stack>
      </SimpleGrid>
      <Divider my={10} />
      <Stack spacing={4} mb={10}>
        <Heading as="h2" size="lg" textAlign="center">
          Why Choose Us?
        </Heading>
        <Text fontSize="md">
          LunaWave Crest Hospital offers a comprehensive range of medical services, from emergency care to specialized treatments. Our team of experienced healthcare professionals is dedicated to providing personalized care and ensuring that each patient receives the best possible treatment.
        </Text>
      </Stack>
      <SimpleGrid columns={[1, null, 3]} spacing={10}>
        <Box textAlign="center">
          <Image mx='auto' src="https://via.placeholder.com/200" alt="Advanced Technology" borderRadius="full" mb={4} />
          <Heading as="h3" size="md">Advanced Technology</Heading>
          <Text fontSize="sm">We use the latest medical technology to diagnose and treat our patients, ensuring accurate and efficient care.</Text>
        </Box>
        <Box textAlign="center">
          <Image mx='auto' src="https://via.placeholder.com/200" alt="Experienced Staff" borderRadius="full" mb={4} />
          <Heading as="h3" size="md">Experienced Staff</Heading>
          <Text fontSize="sm">Our team consists of highly skilled and compassionate professionals dedicated to providing the best care possible.</Text>
        </Box>
        <Box textAlign="center">
          <Image mx='auto' src="https://via.placeholder.com/200" alt="Patient-Centered Care" borderRadius="full" mb={4} />
          <Heading as="h3" size="md">Patient-Centered Care</Heading>
          <Text fontSize="sm">We prioritize the needs and comfort of our patients, ensuring a supportive and caring environment.</Text>
        </Box>
      </SimpleGrid>
      <Divider my={10} />
      <Stack spacing={4} mb={10}>
        <Heading as="h2" size="lg" textAlign="center">
          Our History
        </Heading>
        <Text fontSize="md">
          Founded in 1985, LunaWave Crest Hospital has grown from a small community clinic to a leading healthcare institution. Our journey has been marked by continuous improvement, innovation, and a commitment to excellence in patient care.
        </Text>
      </Stack>
      <Stack spacing={4} mb={10}>
        <Heading as="h2" size="lg" textAlign="center">
          Our Services
        </Heading>
        <Text fontSize="md">
          LunaWave Crest Hospital offers a wide range of medical services, including:
        </Text>
        <SimpleGrid columns={[1, null, 2]} spacing={5}>
          <Text fontSize="md">- Emergency and Trauma Care</Text>
          <Text fontSize="md">- Cardiology</Text>
          <Text fontSize="md">- Neurology</Text>
          <Text fontSize="md">- Orthopedics</Text>
          <Text fontSize="md">- Pediatrics</Text>
          <Text fontSize="md">- Maternity Services</Text>
          <Text fontSize="md">- Oncology</Text>
          <Text fontSize="md">- General Surgery</Text>
        </SimpleGrid>
      </Stack>
      <Divider my={10} />
      <Stack spacing={4}>
        <Heading as="h2" size="lg" textAlign="center">
          Contact Us
        </Heading>
        <Text fontSize="md" textAlign="center">
          If you have any questions or would like more information about LunaWave Crest Hospital, please don't hesitate to contact us.
        </Text>
        <Text fontSize="md" textAlign="center">
          Email: info@LunaWave Cresthospital.com | Phone: (123) 456-7890
        </Text>
      </Stack>
    </Box>
  </MainLayout>
  );
}

export default AboutUs;
