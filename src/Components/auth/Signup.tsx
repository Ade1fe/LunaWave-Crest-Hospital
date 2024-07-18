import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Heading,
    VStack,
    Select,
    useToast,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { auth, db } from '../../firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  
  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Urology',
    // Add more specializations as needed
  ];
  
  const Signup: React.FC = () => {
    const [role, setRole] = useState<'doctor' | 'patient'>('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
  
    const generateDoctorCode = () => {
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    };
  
    const handleSignup = async () => {
        setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user) {
          const userData: any = {
            role,
            email,
            name,
            uid: user.uid,
          };
          
          if (role === 'doctor') {
            userData.specialization = specialization;
          } else if (role === 'patient') {
            userData.age = age;
            userData.gender = gender;
          }
  
          await setDoc(doc(db, 'users', user.uid), userData);
  
          if (role === 'doctor') {
            const doctorCode = generateDoctorCode();
            await setDoc(doc(db, 'doctors', user.uid), { 
                code: doctorCode,
                role,
                email,
                name,
                uid: user.uid,
                specialization,
            });
            toast({
              title: 'Account created.',
              description: `Doctor code: ${doctorCode}`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Account created.',
              description: 'Welcome to our platform!',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          }
          navigate('/');
        }
      } catch (error) {
        toast({
          title: 'Error creating account.',
          description: (error as Error).message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
    } finally {
        setLoading(false);
      }
    };
  
    return (
      <Box maxW="md" mx="auto" mt="8" p="8" borderWidth="1px" borderRadius="lg" boxShadow="lg">
        <Heading as="h1" mb="6" textAlign="center">
          Signup
        </Heading>
        <VStack spacing="4">
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as 'doctor' | 'patient')}>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormControl>
          {role === 'doctor' && (
            <FormControl>
              <FormLabel>Specialization</FormLabel>
              <Select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Select your specialization"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          {role === 'patient' && (
            <>
              <FormControl>
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Enter your age"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
            </>
          )}
          <Button colorScheme="teal" width="full" onClick={handleSignup}>
          {loading ? "Loading..." : "Signup"}
          </Button>
        </VStack>
      </Box>
    );
  };
  
  export default Signup;
  