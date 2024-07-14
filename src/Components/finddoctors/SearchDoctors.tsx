import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust this import based on your Firebase configuration file
import { Box, Text, Spinner, List, ListItem } from '@chakra-ui/react';

interface Doctor {
  id: string;
  name: string;
  // Add other relevant fields
}

const SearchDoctors: React.FC = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const queryParam = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'doctors'),
          where('name', '>=', queryParam),
          where('name', '<=', queryParam + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Doctor[];
        setDoctors(doctorsList);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      setLoading(false);
    };

    if (queryParam) {
      fetchDoctors();
    }
  }, [queryParam]);

  return (
    <MainLayout>
      <Box p={4}>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Box>
            {doctors.length > 0 ? (
              <List spacing={3}>
                {doctors.map((doctor) => (
                  <ListItem key={doctor.id}>
                    <Text fontSize="lg">{doctor.name}</Text>
                    {/* Add more doctor details as needed */}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text>No doctors found for "{queryParam}".</Text>
            )}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export default SearchDoctors;
