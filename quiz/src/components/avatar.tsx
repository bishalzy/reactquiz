import "./allcomponent.css";
import Endpoints from "../config/endpoints.config";


const Avatar = () => {
  

  const handleGithubLogin = () => {
    window.location.href = Endpoints.githubLogin;
  };


  return (
    <div>
      <div className="logingithub" onClick={handleGithubLogin}>
        <img
          src="/github.png"
          alt="Login with Github"
          className="githubimage"
        />
      </div>
    </div>
  );
};

export default Avatar;