

const ProfileAvatar = () => {
  const handleClick = () => {
    
    console.log("Avatar clicked");
  }

  return (
    <div onClick={handleClick}>
      <img alt="Profile" />
    </div>
  );
};

export default ProfileAvatar;