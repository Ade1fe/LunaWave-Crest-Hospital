


import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getAuth, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { HomePage, ProfilePage, RequestAppointment } from './pages';
import { Login, SearchDoctors, Signup } from './Components';


const AppRouter = () => {
  const [, setCurrentUser] = useState<User | null>(null);
  const [offlineError, setOfflineError] = useState(false); // State to track offline error

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log(userData);
          } else {
            console.log('User document does not exist');
          }
          setOfflineError(false); // Reset offline error state if successful
        } catch (error:any) {
          console.error('Error fetching user data:', error);
          if (error.code === 'unavailable') {
            setOfflineError(true); // Set offline error state if Firebase is offline
          }
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/doctors', element: <SearchDoctors /> },
    { path: '/login', element: <Login /> },
    { path: '/Signup', element: <Signup /> },
    { path: '/Profile', element: <ProfilePage /> },
    { path: '/requestappointment', element: <RequestAppointment /> },
  ];

  // Create browser router with routes
  const router = createBrowserRouter(routes);

  if (offlineError) {
    return <div>Offline: Please check your internet connection.</div>;
  }

  return <RouterProvider router={router} />;
};

export default AppRouter;
