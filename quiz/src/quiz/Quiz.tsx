import './quiz.css';
import { Link, Outlet } from 'react-router-dom';


const Quiz:React.FC = () => {




    return(
        <div className="quiz">
            <div className="nav-bar"><Link to={"/singleplayer"} className='change-mode'><p>SinglePlayer MOde</p></Link> <Link to={"/multiplayer"} className='change-mode'><p>MultiPlayer MOde</p></Link></div>
            <div className="box">

                <Outlet/>
                
            </div>
           
            <div className="footer">2025 All Rights Reserved @</div>

        </div>
    )
}


export default Quiz;