import "./profile.css"
import { logoutUser } from "../../services/user.api";
import { Link } from "react-router-dom";

const ProfileDropdown = (props:{ isOpen: boolean }) => {

  const handleLogout = async () => {
    await logoutUser();
    window.location.reload();
  }

  return (
    <div className={`profile-dropdown ${props.isOpen ? "open" : ""}`}>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;