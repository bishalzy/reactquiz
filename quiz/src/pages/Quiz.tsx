import './quiz.css';
import { Link, Outlet } from 'react-router-dom';
import Avatar from '../components/avatar';

const Quiz:React.FC = () => {


 



    return(
        <div className="quiz">
            <div className="nav-bar">
                <Link to={"/"} className='change-mode'><p>Home</p></Link>
                <Link to={"/singleplayer"} className='change-mode'><p>SinglePlayer MOde</p></Link>
                <Link to={"/multiplayer"} className='change-mode'><p>MultiPlayer MOde</p></Link>
                <Avatar/>
            </div>
            <div className="box">

                <Outlet/>
                
            </div>
           
            <div className="footer">{new Date().getFullYear()} All Rights Reserved @</div>

        </div>
    )
}


export default Quiz;