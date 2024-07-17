import React, { useEffect, useState } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Experience, Service } from '../profile/ProfileBio';
import { Box, Text, Spinner, Image } from '@chakra-ui/react';

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

  return (
    <MainLayout>
      <Box p={4}>
        {loading ? (
          <Spinner size="xl" />
        ) : doctorData ? (
          <Box>
            <Text fontSize="2xl">Request an appointment with Dr. {doctorData.name}</Text>
            <Image src={doctorData.imageUrl} alt={doctorData.name} boxSize="150px" borderRadius="full" mt={4} />
            <Text mt={2} fontSize="lg">Specialization: {doctorData.specialization}</Text>
            <Text mt={2} fontSize="lg">Location: {doctorData.workLocation}</Text>
            <Text mt={2} fontSize="lg">Phone: {doctorData.phoneNumber}</Text>
            <Text mt={2} fontSize="lg">Email: {doctorData.email}</Text>
            <Text mt={2} fontSize="lg">Bio: {doctorData.bio}</Text>
            <Text mt={2} fontSize="lg">Age: {doctorData.age}</Text>

            <Box mt={4}>
              <Text fontSize="xl">Services Offered</Text>
              {doctorData.services.length > 0 ? (
                doctorData.services.map((service: Service, index: number) => (
                  <Text key={index} mt={2}>{service.service}: ${service.price}</Text>
                ))
              ) : (
                <Text>No services listed.</Text>
              )}
            </Box>

            <Box mt={4}>
              <Text fontSize="xl">Experience</Text>
              {doctorData.experiences.length > 0 ? (
                doctorData.experiences.map((experience: Experience, index: number) => (
                  <Text key={index} mt={2}>{experience.position} at {experience.workplace} ({experience.startYear} - {experience.endYear})</Text>
                ))
              ) : (
                <Text>No experience listed.</Text>
              )}
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
