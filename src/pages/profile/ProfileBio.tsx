import { useState, useEffect } from 'react';
import { Box, Image, Text, Button, Input, Avatar, Textarea, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Icon } from '@chakra-ui/react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, onAuthStateChanged } from 'firebase/auth';
import { CgProfile } from 'react-icons/cg';
import { FcAbout } from 'react-icons/fc';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';
import { AdvertComp } from '../../Components';
import { SlCalender } from 'react-icons/sl';

export interface Service {
  service: string;
  price: number;
}

export interface Experience {
  workplace: string;
  position: string;
  workLocation: string;
  startYear: string;
  endYear: string;
}

const ProfileBio = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [age, setAge] = useState<string | number>('');
  const [phoneNumber, setPhoneNumber] = useState<string | number>('');  
  const [address, setAddress] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserData(null);
        setDoctorData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserData(userData);
        setBio(userData.bio || '');
        setAge(userData.age || '');
        setPhoneNumber(userData.phoneNumber || '');
        setAddress(userData.address || '');
        setServices(Array.isArray(userData.services) ? userData.services : []);
        if (userData.role === 'doctor') {
          fetchDoctorData(uid);
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  const fetchDoctorData = async (uid: string) => {
    try {
      const doctorDocRef = doc(db, 'users', uid);
      const doctorDoc = await getDoc(doctorDocRef);
      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        setDoctorData(doctorData);
        setExperiences(Array.isArray(doctorData.experiences) ? doctorData.experiences : []);
      } else {
        console.log('No such document in doctors collection!');
      }
    } catch (error) {
      console.error('Error getting doctor document:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      if (selectedFile && user) {
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(fileRef, selectedFile);
        const fileURL = await getDownloadURL(fileRef);

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { imageUrl: fileURL });

        setUserData((prevData: any) => ({
          ...prevData,
          imageUrl: fileURL,
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (field: string, value: any) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { [field]: value });
      } catch (error) {
        console.error(`Error saving ${field}:`, error);
      }
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleServiceChange = (index: number, key: keyof Service, value: string | number) => {
    const updatedServices = [...services];
    if (key === 'service') {
      updatedServices[index].service = value as string;
    } else if (key === 'price') {
      updatedServices[index].price = typeof value === 'string' ? parseFloat(value) : value;
    }
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([...services, { service: '', price: 0 }]);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleExperienceChange = (index: number, key: keyof Experience, value: string) => {
    const updatedExperiences = [...experiences];
    if (key === 'workplace') {
      updatedExperiences[index].workplace = value;
    } else if (key === 'position') {
      updatedExperiences[index].position = value;
    } else if (key === 'workLocation') {
      updatedExperiences[index].workLocation = value;
    } else if (key === 'startYear') {
      updatedExperiences[index].startYear = value;
    } else if (key === 'endYear') {
      updatedExperiences[index].endYear = value;
    }
    setExperiences(updatedExperiences);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { workplace: '', position: '', workLocation: '', startYear: '', endYear: '' }]);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  const saveChanges = async () => {
    if (editMode) {
      try {
        await Promise.all([
          handleFieldChange('bio', bio),
          handleFieldChange('age', age),
          handleFieldChange('phoneNumber', phoneNumber),
          handleFieldChange('address', address),
          saveServicesToFirestore(),
          saveExperiencesToFirestore(),
        ]);
        setEditMode(false);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  const saveServicesToFirestore = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { services });
      } catch (error) {
        console.error('Error saving services:', error);
      }
    }
  };

  const saveExperiencesToFirestore = async () => {
    if (user) {
      try {
        const doctorDocRef = doc(db, 'users', user.uid);
        await updateDoc(doctorDocRef, { experiences });
      } catch (error) {
        console.error('Error saving experiences:', error);
      }
    }
  };

  return (
    <Box maxW='1400px' mx='auto'>
      {userData ? (
        <>
          <Box display="grid" pos='relative' maxW='1600px' mx='auto' mb='0rem'>
            <Box  h='250px' w='full'>
              <Image w='full' h='full' objectFit='cover' src='https://pbs.twimg.com/profile_banners/1506565313751564289/1674381564/1500x500' />
            </Box>
            <Box display={['block', 'flex']} bg='white'  borderRadius='xl' py='4' px={['2','3','4']} shadow='md' gap="3" alignItems="center"    pos="absolute"
                bottom="-50px"
                left="10%"
                right="10%">
              <Box display='flex' alignItems='center' justifyContent='center' overflow='hidden' boxSize={['80px', '100px','120px','135px', "150px"]} borderRadius='50%' shadow='md'>
                {userData.imageUrl ? (
                  <Image borderRadius="full" w='full' h='full' objectFit='cover'  src={userData.imageUrl} alt="Profile Image" />
                ) : (
                  <Avatar borderRadius="full" w='full' h='full' objectFit='cover'   name={userData.name} />
                )}
              </Box>
              <Box display={['grid']} mt={['2','0']} overflow='hidden' gap="1" cursor='pointer' >
                <Input p='0'  bg='transparent' cursor='pointer' border='0'  type="file" onChange={handleFileChange} />
                <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" onClick={handleUpload} isLoading={loading}>Upload</Button>
              </Box>
             
            </Box>
          </Box>
     
          <Box mt="20"  p="4" maxW='1600px' mx='auto' >
          <Box >
                <Text fontSize="2xl" fontWeight="bold">{userData.name}</Text>
                <Text>{userData.role === 'doctor' ? 'Doctor' : 'Patient'}</Text>
              </Box>
          <Box display={['block', 'block', 'flex']} gap='4' alignItems='flex-start' className="">
          <Box  w={['100%', '100%', "66%"]} >
              <Box display="flex" alignItems="center">
                <Icon as={CgProfile} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                <Text fontSize="xl" fontWeight="bold">Profile</Text>
                <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" ml="auto" onClick={toggleEditMode}>{editMode ? 'Cancel' : 'Edit'}</Button>
              </Box>
              <Box mt="4">
                <Box display="flex" alignItems="center">
                  <Icon as={FcAbout} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                  <Text fontSize={['sm', 'md', "lg"]}  fontWeight="bold">Bio:</Text>
                </Box>
                {editMode ? (
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                ) : (
                  <Text>{bio || 'No bio available'}</Text>
                )}
              </Box>
              <Box mt="4">
                <Box display="flex" alignItems="center">
                  <Icon as={FaMapMarkerAlt} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                  <Text fontSize={['sm', 'md', "lg"]}  fontWeight="bold">Address:</Text>
                </Box>
                {editMode ? (
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                ) : (
                  <Text>{address || 'No address available'}</Text>
                )}
              </Box>
              <Box mt="4">
                <Box display="flex" alignItems="center">
                  <Icon as={MdOutlinePhone} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                  <Text fontSize={['sm', 'md', "lg"]}  fontWeight="bold">Phone Number:</Text>
                </Box>
                {editMode ? (
                  <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                ) : (
                  <Text>{phoneNumber || 'No phone number available'}</Text>
                )}
              </Box>
              <Box mt="4">
                <Box display="flex" alignItems="center">
                  <Icon as={SlCalender} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                  <Text fontSize={['sm', 'md', "lg"]}  fontWeight="bold">Age:</Text>
                </Box>
                {editMode ? (
                  <Input value={age} onChange={(e) => setAge(e.target.value)} />
                ) : (
                  <Text>{age || 'No age available'}</Text>
                )}
              </Box>
            
            </Box>
            <Box w={['85%', '70%', '50%',  "30%"]} mx='auto' mt={['2rem', '2rem', '2rem', '0']}>
            <AdvertComp />
            </Box>
          </Box>
            {userData.role === 'doctor' && (
              <Box mt="8" >
                <Box>
                  <Box display="flex" alignItems="center">
                    <Icon as={CgProfile} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                    <Text fontSize="xl" fontWeight="bold">Services</Text>
                  </Box>
                  {editMode && (
                    <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" mt="2" onClick={handleAddService}>Add Service</Button>
                  )}
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Service</Th>
                          <Th>Price</Th>
                          {editMode && <Th>Actions</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {services.map((service, index) => (
                          <Tr key={index}>
                            <Td>
                              {editMode ? (
                                <Input value={service.service} onChange={(e) => handleServiceChange(index, 'service', e.target.value)} />
                              ) : (
                                service.service
                              )}
                            </Td>
                            <Td>
                              {editMode ? (
                                <Input type="number" value={service.price} onChange={(e) => handleServiceChange(index, 'price', e.target.value)} />
                              ) : (
                                service.price
                              )}
                            </Td>
                            {editMode && (
                              <Td>
                                <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" onClick={() => handleRemoveService(index)}>Remove</Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box mt="8">
                  <Box display="flex" alignItems="center">
                    <Icon as={CgProfile} w={[4 ,5, 6]} h={[4,5,6]} mr={2} />
                    <Text fontSize="xl" fontWeight="bold">Experience</Text>
                  </Box>
                  {editMode && (
                    <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" mt="2" onClick={handleAddExperience}>Add Experience</Button>
                  )}
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Workplace</Th>
                          <Th>Position</Th>
                          <Th>Location</Th>
                          <Th>Start Year</Th>
                          <Th>End Year</Th>
                          {editMode && <Th>Actions</Th>}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {experiences.map((experience, index) => (
                          <Tr key={index}>
                            <Td>
                              {editMode ? (
                                <Input value={experience.workplace} onChange={(e) => handleExperienceChange(index, 'workplace', e.target.value)} />
                              ) : (
                                experience.workplace
                              )}
                            </Td>
                            <Td>
                              {editMode ? (
                                <Input value={experience.position} onChange={(e) => handleExperienceChange(index, 'position', e.target.value)} />
                              ) : (
                                experience.position
                              )}
                            </Td>
                            <Td>
                              {editMode ? (
                                <Input value={experience.workLocation} onChange={(e) => handleExperienceChange(index, 'workLocation', e.target.value)} />
                              ) : (
                                experience.workLocation
                              )}
                            </Td>
                            <Td>
                              {editMode ? (
                                <Input value={experience.startYear} onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)} />
                              ) : (
                                experience.startYear
                              )}
                            </Td>
                            <Td>
                              {editMode ? (
                                <Input value={experience.endYear} onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)} />
                              ) : (
                                experience.endYear
                              )}
                            </Td>
                            {editMode && (
                              <Td>
                                <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" onClick={() => handleRemoveExperience(index)}>Remove</Button>
                              </Td>
                            )}
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            )}
            {editMode && (
              <Button  _hover={{bg: "orange.800"}} color='white' bg="#541e1b" mt="8" onClick={saveChanges}>Save Changes</Button>
            )}
          </Box>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default ProfileBio;
