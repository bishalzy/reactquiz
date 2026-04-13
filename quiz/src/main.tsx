
import { createRoot } from 'react-dom/client'
import './index.css'

import Single from './pages/Single.tsx';
import Multi from './pages/Multi.tsx'
import Quiz from './pages/Quiz.tsx';
import Profile from './pages/Profile.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Default from './pages/Default.tsx';
import AuthGuard from './components/authGuard.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Quiz/>,
    children:[
      {path:'singleplayer',element:<Single/>},
      {path:'multiplayer',element:<AuthGuard><Multi/></AuthGuard>},
      {path:'profile',element:<Profile/>},
      {path:'/',index:true,element:<Default/>}
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  
    <RouterProvider router={router}/>
  
)
