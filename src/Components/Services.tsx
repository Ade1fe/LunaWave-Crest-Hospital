import { Box, Heading, Text, SimpleGrid, Stack, Image } from "@chakra-ui/react";
import MainLayout from "../Layout/MainLayout";


const services = [
  {
    title: "Emergency and Trauma Care",
    description: "Our emergency department is open 24/7, providing immediate care for acute illnesses and injuries.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Cardiology",
    description: "We offer comprehensive heart care services, including diagnostics, treatment, and rehabilitation.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Neurology",
    description: "Our neurology department specializes in the diagnosis and treatment of nervous system disorders.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Orthopedics",
    description: "We provide advanced care for musculoskeletal conditions, including joint replacement and sports injuries.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Pediatrics",
    description: "Our pediatricians offer compassionate care for children from infancy through adolescence.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Maternity Services",
    description: "We support mothers and babies with prenatal care, labor and delivery services, and postpartum care.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "Oncology",
    description: "Our oncology team provides comprehensive cancer care, from diagnosis to treatment and survivorship.",
    image: "https://via.placeholder.com/300"
  },
  {
    title: "General Surgery",
    description: "Our skilled surgeons perform a wide range of procedures with a focus on minimally invasive techniques.",
    image: "https://via.placeholder.com/300"
  }
];

const Services = () => {
  return (
   <MainLayout  >
     <Box p={8} maxW="7xl" mx="auto" className="texts">
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        Our Services
      </Heading>
      <Text fontSize="lg" textAlign="center" mb={8}>
        Lunawave Hospital offers a comprehensive range of medical services to meet the diverse needs of our patients. Our dedicated team of healthcare professionals is committed to providing the highest quality care.
      </Text>
      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        {services.map((service, index) => (
          <Box key={index} p={5} shadow='sm' _hover={{shadow: "md"}} borderRadius="lg" overflow="hidden">
            <Image mx='auto' src={service.image} alt={service.title} borderRadius="md" mb={4} />
            <Stack spacing={4}>
              <Heading as="h3" size="md">
                {service.title}
              </Heading>
              <Text fontSize="md">
                {service.description}
              </Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
   </MainLayout>
  );
}

export default Services;
