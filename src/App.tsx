

import { useEffect,  } from 'react';
import { ChakraProvider,  } from '@chakra-ui/react';
import { auth, onAuthStateChanged } from './firebase';
import AppRouter from './AppRouter';
import './index.css';

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user.uid);
      } else {
        console.log('User is logged out');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ChakraProvider>
      <AppRouter />
    </ChakraProvider>
  );
}

export default App;
