
import { createRoot } from 'react-dom/client'
import './index.css'

import Single from './pages/Single.tsx';
import Multi from './pages/Multi.tsx'
import Quiz from './pages/Quiz.tsx';
import Profile from './pages/Profile.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Default from './pages/Default.tsx';
import AuthGuard from './components/authGuard.tsx';
import { AuthProvider } from './context/authContext.ts';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Quiz/>,
    children:[
      {path:'singleplayer',element:<Single/>},
      {path:'multiplayer',element:<AuthGuard><Multi/></AuthGuard>},
      {path:'profile',element:<AuthGuard><Profile/></AuthGuard>},
      {path:'/',index:true,element:<Default/>}
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>
  
)
