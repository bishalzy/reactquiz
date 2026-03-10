
import { createRoot } from 'react-dom/client'
import './index.css'

import Single from './components/Single.tsx';
import Multi from './components/Multi.tsx'
import Quiz from './components/Quiz.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Default from './components/Default.tsx';


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
