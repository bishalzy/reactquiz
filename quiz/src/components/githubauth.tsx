import "./allcomponent.css";
import Endpoints from "../config/endpoints.config";

const GithubAuth = () => {
  

  const handleGithubLogin = () => {
    window.location.href = Endpoints.githubLogin;
  };


  return (
    <div>
      <button onClick={handleGithubLogin}>
        Login with Github
      </button>
    </div>
  );
};

export default GithubAuth;