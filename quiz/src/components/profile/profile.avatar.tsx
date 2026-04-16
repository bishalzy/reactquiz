import "./profile.css"
import ProfileDropdown from "./profile.dropdown";
import { useState } from "react";

const ProfileAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log("Avatar clicked");
  }

  return (
    <div className="profile-pic" onClick={handleClick}>
      <img className="profile-pic-img" alt="Profile" src={localStorage.getItem("avatar")?? "/default-avatar.png"} />
      <ProfileDropdown isOpen={isDropdownOpen} />
    </div>
  );
};

export default ProfileAvatar;