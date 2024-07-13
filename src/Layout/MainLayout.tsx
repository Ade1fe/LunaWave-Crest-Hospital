import React, { ReactNode } from 'react';
import { DontReport, Footer, Navbar } from '../Components';
import { Box } from '@chakra-ui/react';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <DontReport />
      <Box>{children}</Box>
      <Footer />
    </div>
  );
}

export default MainLayout;
