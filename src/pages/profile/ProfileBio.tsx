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

interface Service {
  service: string;
  price: number;
}

interface Experience {
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
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        if (userData.role === 'doctor') {
          fetchDoctorData(uid);
        }
        if (userData.services) {
          setServices(userData.services);
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
      const doctorDocRef = doc(db, 'doctors', uid);
      const doctorDoc = await getDoc(doctorDocRef);
      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        setDoctorData(doctorData);
        if (doctorData.experiences) {
          setExperiences(doctorData.experiences);
        }
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

  // const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setBio(e.target.value);
  // };

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
        const doctorDocRef = doc(db, 'doctors', user.uid);
        await updateDoc(doctorDocRef, { experiences });
      } catch (error) {
        console.error('Error saving experiences:', error);
      }
    }
  };

  return (
    <Box>
      {userData ? (
        <>
         
         <Box display="grid" pos='relative' maxW='1600px' mx='auto' mb='6rem'>
         <Box bg='red' h='250px' className="" w='full'>
              <Image w='full' h='full' objectFit='cover' src='https://pbs.twimg.com/profile_banners/1506565313751564289/1674381564/1500x500' />
            </Box>
            <Box display={['block', 'flex']} gap="3" alignItems="center" pos='absolute' bottom='-70px' left='50px'>
            <Box bg='green'>
              {userData.imageUrl ? (
                <Image borderRadius="full" boxSize="150px" src={userData.imageUrl} alt="Profile Image" />
              ) : (
                <Avatar size="xl" name={userData.name} />
              )}
            </Box>
            <Box display={['grid']} gap="3">
              <Input w="fit-content" size="sm" type="file" onChange={handleFileChange} />
              <Button size="sm" ml="2" w="fit-content" onClick={handleUpload} colorScheme="blue">
                {loading ? 'Loading...' : 'Upload Image'}
              </Button>
            </Box>
         </Box>
           
          </Box>
          <Text fontSize={['md', 'lg', 'xl']} fontWeight="bold">
            {userData.name}
          </Text>
          {userData.role === 'doctor' && doctorData && (
            <Box w={['70%']} bg='yellow'>
              <Text>Specialization: {doctorData.specialization}</Text>
              <Text>Role: {userData.role}</Text>
              <Text>Code: {doctorData.code}</Text>

              {editMode ? (
                <>
                  <Box>
                    <Text>Age</Text>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onBlur={() => handleFieldChange('age', age)}
                      placeholder="Enter your age"
                    />
                  </Box>
                  <Box>
                    <Text>Phone Number</Text>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={() => handleFieldChange('phoneNumber', phoneNumber)}
                      placeholder="Enter your phone number"
                    />
                  </Box>
                  <Box>
                    <Text>Address</Text>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => handleFieldChange('address', address)}
                      placeholder="Enter your address"
                    />
                  </Box>
                  <Box>
                    <Text>Bio</Text>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={() => handleFieldChange('bio', bio)}
                      placeholder="Enter your bio"
                    />
                  </Box>
                  <TableContainer>
                    <Text>Service and Price List</Text>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Service</Th>
                          <Th>Price</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {services.map((service, index) => (
                          <Tr key={index}>
                            <Td>
                              <Input
                                type="text"
                                value={service.service}
                                onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                                placeholder="Enter service"
                              />
                            </Td>
                            <Td>
                              <Input
                                type="number"
                                value={service.price}
                                onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value))}
                                placeholder="Enter price"
                              />
                            </Td>
                            <Td>
                              <Button size="sm" onClick={() => handleRemoveService(index)}>
                                Remove
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Button size="sm" onClick={handleAddService}>
                      Add Service
                    </Button>
                  </TableContainer>
                  <TableContainer mt={4}>
                    <Text>Experience List</Text>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Workplace</Th>
                          <Th>Position</Th>
                          <Th>Location</Th>
                          <Th>Start Year</Th>
                          <Th>End Year</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {experiences.map((experience, index) => (
                          <Tr key={index}>
                            <Td>
                              <Input
                                type="text"
                                value={experience.workplace}
                                onChange={(e) => handleExperienceChange(index, 'workplace', e.target.value)}
                                placeholder="Enter workplace"
                              />
                            </Td>
                            <Td>
                              <Input
                                type="text"
                                value={experience.position}
                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                placeholder="Enter position"
                              />
                            </Td>
                            <Td>
                              <Input
                                type="text"
                                value={experience.workLocation}
                                onChange={(e) => handleExperienceChange(index, 'workLocation', e.target.value)}
                                placeholder="Enter location"
                              />
                            </Td>
                            <Td>
                              <Input
                                type="text"
                                value={experience.startYear}
                                onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
                                placeholder="Enter start year"
                              />
                            </Td>
                            <Td>
                              <Input
                                type="text"
                                value={experience.endYear}
                                onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
                                placeholder="Enter end year"
                              />
                            </Td>
                            <Td>
                              <Button size="sm" onClick={() => handleRemoveExperience(index)}>
                                Remove
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Button size="sm" onClick={handleAddExperience}>
                      Add Experience
                    </Button>
                  </TableContainer>
                </>
              ) : (
                <>
                  <Text>Age: {age}</Text>
                  <Text>Phone Number: {phoneNumber}</Text>
                  <Text>Address: {address}</Text>
                  <Text>Bio: {bio}</Text>
                  <TableContainer>
                    <Text>Service and Price List</Text>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Service</Th>
                          <Th>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {services.map((service, index) => (
                          <Tr key={index}>
                            <Td>{service.service}</Td>
                            <Td>{service.price}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <TableContainer mt={4}>
                    <Text>Experience List</Text>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Workplace</Th>
                          <Th>Position</Th>
                          <Th>Location</Th>
                          <Th>Years Worked</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {experiences.map((experience, index) => (
                          <Tr key={index}>
                            <Td>{experience.workplace}</Td>
                            <Td>{experience.position}</Td>
                            <Td>{experience.workLocation}</Td>
                            <Td>{`${experience.startYear} - ${experience.endYear}`}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Box>
          )}
          {userData.role === 'patient' && (
            <>
              <Text w={['50%']} bg='blue' fontSize={['sm', 'md', 'lg']} color="gray.500">
                {userData.role}
              </Text>
              <Text w={['50%']} bg='blue' fontSize={['sm','md']} fontWeight='500' display='flex' alignItems='center' gap='2'><Icon as={MdOutlineEmail} boxSize={[4,5,6]} /> {userData.email}</Text>
              {editMode ? (
                <Box fontSize={['sm','md']} fontWeight='500' w={['50%']} bg='blue'>
                  <Box mb='4'>
                    <Text>Age</Text>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onBlur={() => handleFieldChange('age', age)}
                      placeholder="Enter your age"
                    />
                  </Box>
                  <Box mb='4'>
                    <Text>Phone Number</Text>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={() => handleFieldChange('phoneNumber', phoneNumber)}
                      placeholder="+23490386013"
                    />
                  </Box>
                  <Box mb='4'>
                    <Text>Address</Text>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => handleFieldChange('address', address)}
                      placeholder="Enter your address"
                    />
                  </Box>
                  <Box mb='4'>
                    <Text>Bio</Text>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={() => handleFieldChange('bio', bio)}
                      placeholder="Enter your bio"
                    />
                  </Box>
                </Box>
              ) : (
                <Box fontSize={['sm','md']} fontWeight='500' w={['50%']} bg='blue'>
                   <Text mb='3' display='flex' alignItems='center' gap='2'>  {bio}</Text>
                  <Text mb='3' display='flex' alignItems='center' gap='2'> <Icon as={CgProfile} boxSize={[4,5,6]} /> {age}</Text>
                  <Text mb='3' display='flex' alignItems='center' gap='2'> <Icon as={MdOutlinePhone} boxSize={[4,5,6]} />  {phoneNumber}</Text>
                  <Text mb='3' display='flex' alignItems='center' w='full' bg='green' gap='2' > <Icon as={FaMapMarkerAlt} boxSize={[4,5,6]} />  {address}</Text>
                 
                </Box>
              )}
            </>
          )}
          <Button onClick={toggleEditMode} mt={4} size="sm">
            {editMode ? 'Save Changes' : 'Edit Profile'}
          </Button>
          {editMode && (
            <Button onClick={saveChanges} mt={4} ml={4} size="sm">
              Cancel
            </Button>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default ProfileBio;
