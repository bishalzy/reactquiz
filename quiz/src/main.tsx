
import { createRoot } from 'react-dom/client'
import './index.css'

import Single from './pages/Single.tsx';
import Multi from './pages/Multi.tsx'
import Quiz from './pages/Quiz.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Default from './pages/Default.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Quiz/>,
    children:[
      {path:'singleplayer',element:<Single/>},
      {path:'multiplayer',element:<Multi/>},
      {index:true,element:<Default/>}
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  
    <RouterProvider router={router}/>
  
)
