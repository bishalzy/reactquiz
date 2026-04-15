import "./allcomponent.css";
import Endpoints from "../config/endpoints.config";
import useAuth from "../hooks/useAuth";
import ProfileAvatar from "./profile/profile.avatar";

const Avatar = () => {
  const { user } = useAuth();

  const handleGithubLogin = () => {
    window.location.href = Endpoints.githubLogin;
  };


  return (
    <div>
      {user ? (
        <ProfileAvatar />
      ) : (
      <div className="logingithub" onClick={handleGithubLogin}>
        <img
          src="/github.png"
          alt="Login with Github"
          className="githubimage"
        />
      </div>
      )}
    </div>
  );
};

export default Avatar;