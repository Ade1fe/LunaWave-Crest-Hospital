import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../Layout/MainLayout';
import {
  Box,
  Text,
  Spinner,
  Image,
  Input,
  Textarea,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Avatar,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { AdvertComp, SomethingIs } from '../../Components';
import { Experience, Service } from '../profile/ProfileBio';
import { imgImg } from '../../assets';

const RequestAppointment: React.FC = () => {
  const queryParam = new URLSearchParams(location.search).get('query');
  const [doctorData, setDoctorData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (queryParam) {
      fetchDoctorData(queryParam);
    }
  }, [queryParam]);

  const fetchDoctorData = async (uid: string) => {
    setLoading(true);
    try {
      const doctorDocRef = doc(db, 'users', uid);
      const doctorDoc = await getDoc(doctorDocRef);
      if (doctorDoc.exists()) {
        setDoctorData(doctorDoc.data());
      } else {
        console.log('No such document in doctors collection!');
      }
    } catch (error) {
      console.error('Error getting doctor document:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      appointmentDate: '',
      notes: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      confirmation: false,
    },
    validationSchema: Yup.object({
      appointmentDate: Yup.date().required('Appointment date is required'),
      userName: Yup.string().required('Name is required'),
      userEmail: Yup.string().email('Invalid email address').required('Email is required'),
      userPhone: Yup.string().required('Phone number is required'),
      confirmation: Yup.bool().oneOf([true], 'You must confirm to proceed'),
    }),
    onSubmit: (values) => {
      console.log('Form values:', values);
      // Handle form submission logic, e.g., send to backend or Firestore
    },
  });

  return (
    <MainLayout>
      <Box p={4} className='texts' maxW="1400px"  mx="auto" mb="5rem">
        {loading ? (
          <Spinner size="xl" />
        ) : doctorData ? (
          <Box>
            <Box display="grid"  pos="relative" >
              <Image
                w="full"
                h="250px"
                objectFit="cover"
                src={imgImg}
                alt="Doctor Banner"
              />
              <Box
                bg="white"
                borderRadius="xl"
                py={4}
                px={6}
                shadow="sm"
                display='flex' flexDir={['column','row']} alignItems='center' gap='3'
                // spacing={4}
                pos="absolute"
                bottom="-50px"
                left="10%"
                right="10%"
              >
                <Avatar
                  src={doctorData.imageUrl}
                  name={doctorData.name}
                  size="xl"
                  borderRadius="full"
                  boxShadow="md"
                />
                <VStack  align="start">
                  <Text fontSize={[  'md', 'lg', 'x-large', "2xl"]} fontWeight="bold">
                    Request an appointment with {doctorData.name}
                  </Text>
                  <Text fontSize={['sm','md', "lg"]}>{doctorData.workLocation}. Available Mon-Fri at 8:00am - 5:00pm</Text>
                </VStack>
              </Box>
            </Box>
            <Box mt="6rem" p={4} borderRadius="lg" shadow="sm" bg="white">
              <Text fontSize={['sm','md', "lg"]} fontWeight="bold" mb={2}>
                Doctor's Profile
              </Text>
              <Text w={['full','80%','70%','60%']} fontSize={['sm','md']} mb={2}>{doctorData.bio}</Text>
              <Text mb={2} fontSize={['sm','md']} >
                Specialization: {doctorData.specialization}
              </Text>
              <Text mb={2} fontSize={['sm','md']} >
                Contact: <strong>{doctorData.phoneNumber}</strong> |{' '}
                <strong>{doctorData.email}</strong>
              </Text>
            </Box>
            <SimpleGrid columns={[1, 1, 2]} spacing={[4,5,6]} mt='3rem'>
              <Box p={4} borderRadius="lg" shadow="sm" bg="white">
                <Text fontSize={['sm','md', "lg"]} fontWeight="bold" mb={2}>
                  Services Offered
                </Text>
                {doctorData.services && doctorData.services.length > 0 ? (
                  doctorData.services.map((service: Service, index: number) => (
                    <Text key={index} mt={2}>
                      {service.service}: ${service.price}
                    </Text>
                  ))
                ) : (
                  <Text>No services listed.</Text>
                )}
              </Box>
              <Box p={4} borderRadius="lg" shadow="sm" bg="white">
                <Text fontSize={['sm','md', "lg"]} fontWeight="bold" mb={2}>
                  Experience
                </Text>
                {doctorData.experiences && doctorData.experiences.length > 0 ? (
                  doctorData.experiences.map((experience: Experience, index: number) => (
                    <Text key={index} mt={2}>
                      {experience.position} at {experience.workplace} ({experience.startYear} - {experience.endYear})
                    </Text>
                  ))
                ) : (
                  <Text>No experience listed.</Text>
                )}
              </Box>
            </SimpleGrid>
            <Box w={['85%', '70%', '60%',  "50%"]} mx='auto' mt='4rem'>
              <AdvertComp />
            </Box>
            <Box mt='6rem' p={4} borderRadius="lg" shadow="md" bg="white" w={['full', '90%','80%','70%',]} mx='auto' fontSize={['sm','md']} >
              <Text fontSize="xl" fontWeight='900' textAlign='center' mb='3rem'>
                Appointment Request Form
              </Text>
              <form onSubmit={formik.handleSubmit}>
                <FormControl isInvalid={formik.touched.appointmentDate && !!formik.errors.appointmentDate} mb={4}>
                  <FormLabel htmlFor="appointmentDate">Preferred Appointment Date</FormLabel>
                  <Input id="appointmentDate" type="date" {...formik.getFieldProps('appointmentDate')} />
                  <FormErrorMessage>{formik.errors.appointmentDate as string}</FormErrorMessage>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel htmlFor="notes">Additional Notes</FormLabel>
                  <Textarea id="notes" {...formik.getFieldProps('notes')} />
                </FormControl>
                <FormControl isInvalid={formik.touched.userName && !!formik.errors.userName} mb={4}>
                  <FormLabel htmlFor="userName">Your Name</FormLabel>
                  <Input id="userName" type="text" {...formik.getFieldProps('userName')} />
                  <FormErrorMessage>{formik.errors.userName as string}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.touched.userEmail && !!formik.errors.userEmail} mb={4}>
                  <FormLabel htmlFor="userEmail">Your Email</FormLabel>
                  <Input id="userEmail" type="email" {...formik.getFieldProps('userEmail')} />
                  <FormErrorMessage>{formik.errors.userEmail as string}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.touched.userPhone && !!formik.errors.userPhone} mb={4}>
                  <FormLabel htmlFor="userPhone">Your Phone Number</FormLabel>
                  <Input id="userPhone" type="text" {...formik.getFieldProps('userPhone')} />
                  <FormErrorMessage>{formik.errors.userPhone as string}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={formik.touched.confirmation && !!formik.errors.confirmation} mb={4}>
                  <Checkbox id="confirmation" {...formik.getFieldProps('confirmation')}>
                    I understand this is an appointment request, and I must wait for confirmation.
                  </Checkbox>
                  <FormErrorMessage>{formik.errors.confirmation as string}</FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="teal" mt={4}>
                  Submit Request
                </Button>
              </form>
            </Box>
            <Box mt={4}>
              <SomethingIs />
            </Box>
          </Box>
        ) : (
          <Text>No doctor found with the provided ID.</Text>
        )}
      </Box>
    </MainLayout>
  );
};

export default RequestAppointment;
