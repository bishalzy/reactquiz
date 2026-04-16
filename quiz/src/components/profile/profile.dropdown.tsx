import "./profile.css"
import { logoutUser } from "../../services/user.api";
import { Link } from "react-router-dom";

const ProfileDropdown = (props:{ isOpen: boolean }) => {

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  }

  // const handleProfile = () => {
  //   // Implement profile navigation here
  //   console.log("Profile clicked");
  // }


  return (
    <div className={`profile-dropdown ${props.isOpen ? "open" : ""}`}>
      <ul>
        <li><Link to="/profile">Profile</Link></li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;