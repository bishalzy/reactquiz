import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Single from './quiz/Single.tsx';
import Multi from './quiz/Multi.tsx'
import Quiz from './quiz/Quiz.tsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Default from './quiz/Default.tsx';


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
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
