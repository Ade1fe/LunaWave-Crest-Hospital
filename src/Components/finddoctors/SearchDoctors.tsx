import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../Layout/MainLayout';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { Box, Text, Spinner, List, ListItem, Image, Button, Input, InputGroup, Avatar, Icon } from '@chakra-ui/react';
import { AdvertComp, SomethingIs } from '..';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Doctor {
  specialization: string;
  id: string;
  name: string;
  workLocation: string;
  uid: string;
}

interface DoctorWithImageUrl extends Doctor {
  imageUrl?: string;
}

const SearchDoctors: React.FC = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState<DoctorWithImageUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userImages, setUserImages] = useState<{ uid: string; imageUrl: string }[]>([]); // State for user images
  const queryParam = new URLSearchParams(location.search).get('query');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const doctorsPerPage = 5; // Number of doctors to display per page

  // Fetch user images separately
  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const q = collection(db, 'users');
        const querySnapshot = await getDocs(q);
        const userImagesList = querySnapshot.docs.map(doc => ({
          uid: doc.id,
          imageUrl: doc.data().imageUrl || '', // Ensure imageUrl is defined
        }));
        setUserImages(userImagesList);
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };

    fetchUserImages();
  }, []);

  // Fetch doctors and merge with user images
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const q = collection(db, 'doctors');
        const querySnapshot = await getDocs(q);
        const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Doctor[];

        // Merge doctors with user images
        const updatedDoctorsList = doctorsList.map(doctor => {
          const userImage = userImages.find(user => user.uid === doctor.uid);
          return { ...doctor, imageUrl: userImage?.imageUrl };
        });

        // Filter doctors based on case-insensitive search
        const filteredDoctors = updatedDoctorsList.filter(doctor =>
          doctor.name.toLowerCase().includes(queryParam?.toLowerCase() ?? '')
        );

        setDoctors(filteredDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, [queryParam, userImages]);

  const makeAnAppointment = (doctorId: string) => {
    navigate(`/requestappointment?query=${encodeURIComponent(doctorId)}`);
  };

  // Pagination Logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Render dynamic pagination buttons
  const renderPagination = () => {
    const pageButtons = [];
    const maxPagesToShow = 3; // Maximum number of page buttons to show

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <Button
            key={i}
            onClick={() => goToPage(i)}
            bg={currentPage === i ? "orange.900" : "orange.700"}
            colorScheme="orange"
         // mr={1}
         borderRadius='0'
          >
            {i}
          </Button>
        );
      }
    } else {
      // Calculate start and end of page range around current page
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      // Render page buttons
      if (startPage > 1) {
        pageButtons.push(
          <Button
            key={1}
            onClick={() => goToPage(1)}
            bg='transparent'
            shadow='md'
            p='0'
           // mr={1}
           borderRadius='0'
          >
            1
          </Button>
        );
        if (startPage > 2) {
          pageButtons.push(<Text key="ellipsis1">...</Text>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <Button
            key={i}
            onClick={() => goToPage(i)}
            bg={currentPage === i ? "orange.800" : "white"}
            color={currentPage === i ? "white" : "black"}
            colorScheme="orange"
            shadow='md'
            // mr={1}
            borderRadius='0'
          >
            {i}
          </Button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageButtons.push(<Text key="ellipsis2">...</Text>);
        }
        pageButtons.push(
          <Button
            key={totalPages}
            onClick={() => goToPage(totalPages)}
            // variant="outline"
            bg='transparent'
            shadow='md'
            p='0'
          // mr={1}
          borderRadius='0'
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pageButtons;
  };

  return (
    <MainLayout>
      <Box p={4} maxW='1430px' mx='auto' className='texts'>
        <Box mb={4}>
          <InputGroup size={['sm', 'md']}>
            <Input
              focusBorderColor="#f9f9f9f9"
              borderRadius="0"
              placeholder="Search for doctors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button _hover={{bg: "orange.800"}} color='white' bg="#541e1b" colorScheme="teal" ml={2} onClick={() => navigate(`/doctors?query=${encodeURIComponent(searchQuery)}`)}>
              Search
            </Button>
          </InputGroup>
        </Box>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Box display={['block', 'block', 'flex']} justifyContent='space-between' gap='4' alignItems='flex-start'>
            <Box w={['100%', '90%','80%', "50%"]}>
              {currentDoctors.length > 0 ? (
                <List spacing={3}>
                  {currentDoctors.map((doctor) => (
                    <ListItem  p='4' key={doctor.id} borderBottomWidth='1px' borderBottomColor="gray.200" mb='2rem' display='flex' justifyContent='space-between' alignItems='flex-start' px={['3']}>
                      <Box display={['flex']}  flexDir={['column','column','row']} alignItems='center' gap='2'>
                        {doctor.imageUrl ? (
                          <Image boxSize={['150px','160px','130px','120px',"120px"]} borderRadius='50%' src={doctor.imageUrl} alt="Doctor Image" />
                        ) : (
                          <Avatar boxSize={['150px','160px','140px','130px','120px']} name={doctor.name} size="md" />
                        )}
                        <Box  fontSize={[ 'md', "lg"]} className="">
                          <Text fontWeight='900'>{doctor.name}</Text>
                          <Text color='f9f9f9' fontSize={['xs','sm']} fontWeight='400'>{doctor.specialization}</Text>
                          <Text  fontWeight='300' fontSize={['sm','md']}>{doctor.workLocation}</Text>
                        </Box>
                      </Box>
                      <Box py='2' px='4' shadow='md' borderRadius='md' fontSize={['xs','sm']} onClick={() => makeAnAppointment(doctor.id)} mt='1rem'>
                        <Text  cursor="pointer">Make An Appointment</Text>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text>No doctors found for "{queryParam}".</Text>
              )}
            </Box>
            <Box w={['85%', '70%', '50%',  "30%"]} mx='auto'>
         <Box w='full' className="">
         <AdvertComp />
         </Box>
           <Box className="">
           <SomethingIs />
           </Box>
          </Box>
          </Box>
        )}

        {/* Pagination */}
        {doctors.length > doctorsPerPage && (
          <Box mt='3rem' display="flex" justifyContent="center" alignItems="center">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              bg='transparent'
              shadow='md'
              mr={2}
              p='0'
            >
               <Icon as={FaChevronLeft} />
            </Button>
            {renderPagination()}
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              bg='transparent'
              shadow='md'
              ml={2}
              p='0'
            >
             <Icon as={FaChevronRight} />
            </Button>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export default SearchDoctors;
