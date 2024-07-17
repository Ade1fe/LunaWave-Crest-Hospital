import { Box, Text, Heading, Button, Flex, Image, VStack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';

// Define keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const hoverEffect = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;

const AdvertComp = () => {
  const [currentAdvert, setCurrentAdvert] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdvert(prev => (prev + 1) % 3);
    }, 30000); // 300,000 ms = 5 minutes

    return () => clearInterval(interval);
  }, []);

  const adverts = [
    {
      bg: 'blue.500',
      title: 'Build Your Website',
      text: 'Get a stunning website for your business that is both functional and beautiful. Our professional team ensures a seamless and engaging user experience.',
      img: 'https://via.placeholder.com/150',
      features: 'Responsive Design, E-commerce Integration, Customizable Templates, and more.',
      button: 'Get Started'
    },
    {
      bg: 'green.500',
      title: 'Digital Marketing Services',
      text: 'Boost your online presence with our expert digital marketing strategies. We help you reach your target audience effectively.',
      img: 'https://via.placeholder.com/150',
      features: 'Social Media Marketing, Content Creation, Pay-Per-Click Advertising, and more.',
      button: 'Learn More'
    },
    {
      bg: 'purple.500',
      title: 'SEO Optimization',
      text: 'Improve your website\'s ranking on search engines with our SEO services. Our team uses the latest techniques to drive organic traffic to your site.',
      img: 'https://via.placeholder.com/150',
      features: 'Increased Visibility, Higher Traffic, Better ROI, and more.',
      button: 'Optimize Now'
    }
  ];

  return (
    <Box w={[ '90%', '80%', '40%']} mx={['auto', 'auto', '0']} mt={['2rem', '2.5rem', '0']}>
      <Flex direction="column" align="center" justify="center">
        {adverts.map((advert, index) => (
          <Box
            key={index}
            w="fit-content"
            p={3}
            // m={3}
            bg={advert.bg}
            color="white"
            borderRadius="md"
            boxShadow="lg"
            animation={`${fadeIn} 1s ease-out`}
            _hover={{ animation: `${hoverEffect} 0.5s ease-in-out`, transform: 'scale(1.05)' }}
            display={currentAdvert === index ? 'block' : 'none'}
          >
            <VStack align="start" spacing={1} fontSize={['xs', 'sm']}>
              <Heading size={['sm', 'md', "lg"]}>{advert.title}</Heading>
              <Text>{advert.text}</Text>
              <Image src={advert.img} alt={advert.title} borderRadius="md" />
              <Text>
                <strong>Features:</strong> {advert.features}
              </Text>
              <Button colorScheme="teal">{advert.button}</Button>
            </VStack>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default AdvertComp;
