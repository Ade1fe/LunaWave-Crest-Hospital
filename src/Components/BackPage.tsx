import React from 'react';
import { Box, IconButton, Tooltip, keyframes } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const BackPage: React.FC = () => {
  const navigate = useNavigate();

//   const handleBack = () => {
//     navigate(-1);
//   };
  const searchPage = () => {
    navigate('/doctors');
  };

  return (
    <Box animation={`${bounce} 2s infinite`} pos='fixed' bg='white' top='60px' left={['10px','15px','20px','25px','40px']} zIndex='99'>
      <Tooltip label="Go back" aria-label="Go back">
        <IconButton
          icon={<BsSearch />}
          onClick={searchPage}
          aria-label="Back"
          size="lg"
          shadow='md'
        //   variant="outline"
          bg='white'
        />
      </Tooltip>
    </Box>
  );
};

export default BackPage;
