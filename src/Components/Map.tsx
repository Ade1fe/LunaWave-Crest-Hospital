import { Box } from '@chakra-ui/react';
import React from 'react';

const Map = () => {
  return (
    <Box h="500px" w="100%" mt='3'>
      <iframe
        src="https://www.google.com/maps/embed?pb=St+Timothy+Catholic+Hospital,+Ojodu/@6.6497603,3.3558163,17z/data=!3m1!4b1!4m6!3m5!1s0x103b8dc1b6bb19b9:0xb65ecf59771bd2d2!8m2!3d6.649755!4d3.3583912!16s%2Fg%2F11nn331tv1?entry=ttu"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        aria-hidden="false"
      ></iframe>
    </Box>
  );
};

export default Map;
