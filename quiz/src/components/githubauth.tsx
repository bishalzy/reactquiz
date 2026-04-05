import "./allcomponent.css";


const GithubAuth = () => {
  

  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if(!clientId){
      console.error("Client ID is not defined in environment variables");
      return;
    }
    window.location.href = `${import.meta.env.VITE_GITHUB_REDIRECT_URI}?scope=user:email&client_id=${clientId}`;
    // alert("Github login functionality is currently unavailable. Please check back later.");
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