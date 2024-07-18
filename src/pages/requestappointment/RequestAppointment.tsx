import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Experience, Service } from '../profile/ProfileBio';
import { Box, Text, Spinner, Image, Input, Textarea, Button, Checkbox, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AdvertComp, SomethingIs } from '../../Components';

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
        const doctorData = doctorDoc.data();
        setDoctorData(doctorData);
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
      <Box p={4}>
        {loading ? (
          <Spinner size="xl" />
        ) : doctorData ? (
          <Box> 
                        <Box className=""  display={['block', 'block', 'flex']} gap='4' alignItems='center'> 
            <Box className=""w={['100%', '100%', "60%"]} > 
            <Text fontSize="2xl">Request an appointment with Dr. {doctorData.name}</Text>
            <Image src={doctorData.imageUrl} alt={doctorData.name} boxSize="150px" borderRadius="full" mt={4} />
            <Text mt={2} fontSize="lg">Specialization: {doctorData.specialization}</Text>
            <Text mt={2} fontSize="lg">Location: {doctorData.workLocation}</Text>
            <Text mt={2} fontSize="lg">Phone: {doctorData.phoneNumber}</Text>
            <Text mt={2} fontSize="lg">Email: {doctorData.email}</Text>
            <Text mt={2} fontSize="lg">Bio: {doctorData.bio}</Text>
            </Box>
            <AdvertComp />
       </Box>
      <div className="">
      <Box mt={4}>
  <Text fontSize="xl">Services Offered</Text>
  {doctorData.services && doctorData.services.length > 0 ? (
    doctorData.services.map((service: Service, index: number) => (
      <Text key={index} mt={2}>{service.service}: ${service.price}</Text>
    ))
  ) : (
    <Text>No services listed.</Text>
  )}
</Box>

<Box mt={4}>
  <Text fontSize="xl">Experience</Text>
  {doctorData.experiences && doctorData.experiences.length > 0 ? (
    doctorData.experiences.map((experience: Experience, index: number) => (
      <Text key={index} mt={2}>{experience.position} at {experience.workplace} ({experience.startYear} - {experience.endYear})</Text>
    ))
  ) : (
    <Text>No experience listed.</Text>
  )}
</Box>


            <SomethingIs />
      </div>

            <Box mt={8}>
              <Text fontSize="xl" mb={4}>Appointment Request Form</Text>
              <form onSubmit={formik.handleSubmit}>
                <FormControl isInvalid={formik.touched.appointmentDate && !!formik.errors.appointmentDate} mb={4}>
                  <FormLabel htmlFor="appointmentDate">What date would you like for your appointment?</FormLabel>
                  <Input
                    id="appointmentDate"
                    type="date"
                    {...formik.getFieldProps('appointmentDate')}
                  />
                  <FormErrorMessage>{formik.errors.appointmentDate as string}</FormErrorMessage>
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel htmlFor="notes">Any notes or details about your appointment</FormLabel>
                  <Textarea
                    id="notes"
                    {...formik.getFieldProps('notes')}
                  />
                </FormControl>

                <FormControl isInvalid={formik.touched.userName && !!formik.errors.userName} mb={4}>
                  <FormLabel htmlFor="userName">Your Name</FormLabel>
                  <Input
                    id="userName"
                    type="text"
                    {...formik.getFieldProps('userName')}
                  />
                  <FormErrorMessage>{formik.errors.userName as string}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.userEmail && !!formik.errors.userEmail} mb={4}>
                  <FormLabel htmlFor="userEmail">Your Email</FormLabel>
                  <Input
                    id="userEmail"
                    type="email"
                    {...formik.getFieldProps('userEmail')}
                  />
                  <FormErrorMessage>{formik.errors.userEmail as string}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.userPhone && !!formik.errors.userPhone} mb={4}>
                  <FormLabel htmlFor="userPhone">Your Telephone</FormLabel>
                  <Input
                    id="userPhone"
                    type="text"
                    {...formik.getFieldProps('userPhone')}
                  />
                  <FormErrorMessage>{formik.errors.userPhone as string}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formik.touched.confirmation && !!formik.errors.confirmation} mb={4}>
                  <Checkbox
                    id="confirmation"
                    {...formik.getFieldProps('confirmation')}
                  >
                    I understand this is an appointment request, and must wait for the practice to confirm the appointment with me.
                  </Checkbox>
                  <FormErrorMessage>{formik.errors.confirmation as string}</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="teal" mt={4}>Submit Request</Button>
              </form>
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
