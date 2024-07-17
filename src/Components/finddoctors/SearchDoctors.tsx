import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../../firebase'; 
import { Box, Text, Spinner, List, ListItem, Button, InputGroup, Input } from '@chakra-ui/react';
import { AdvertComp } from '..';

interface Doctor {
  specialization: string;
  id: string;
  name: string;
  workLocation: string;
  // Add other relevant fields
}

const SearchDoctors: React.FC = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const queryParam = new URLSearchParams(location.search).get('query');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'doctors');
        const querySnapshot = await getDocs(q);
        const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Doctor[];

        // Filter doctors based on case-insensitive search
        const filteredDoctors = doctorsList.filter(doctor =>
          doctor.name.toLowerCase().includes(queryParam?.toLowerCase() ?? '')
        );
        console.log(doctors,"doctors")
        console.log(doctorsList,"doctorsList")

        setDoctors(filteredDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, [queryParam]);

  const makeAnAppointment = (doctorId: string) => {
    navigate(`/requestappointment?query=${encodeURIComponent(doctorId)}`);
  };

  return (
    <MainLayout>
      <Box p={4}>
        <InputGroup size={['sm', 'md']}>
          <Input
            focusBorderColor="#f9f9f9f9"
            borderRadius="0"
            placeholder="Search for doctors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" colorScheme="teal" ml={2}  onClick={() => navigate(`/doctors?query=${encodeURIComponent(searchQuery)}`)}>
            Search
          </Button>
        </InputGroup>

        {loading ? (
          <Spinner size="xl" />
        ) : (
       
          <Box display={['block', 'block', 'flex']} gap='4' alignItems='flex-start'className="">
   <Box  w={['100%', '100%', "60%"]}>
            {doctors.length > 0 ? (
              <List spacing={3}>
                {doctors.map((doctor) => (
                  <ListItem key={doctor.id} bg='red' my='3' display='flex' justifyContent='space-between' px={['3']}>
                   <div className="">
                   <Text fontSize="lg">{doctor.name}</Text>
                    <Text fontSize="lg">{doctor.specialization}</Text>
                    <Text fontSize="lg">{doctor.workLocation}</Text>
                   </div>
                   <Box onClick={() => makeAnAppointment(doctor.id)}>
                        <Text fontSize="lg" cursor="pointer">Make An Appointment</Text>
                      </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text>No doctors found for "{queryParam}".</Text>
            )}
          </Box>
<AdvertComp />
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export default SearchDoctors;
