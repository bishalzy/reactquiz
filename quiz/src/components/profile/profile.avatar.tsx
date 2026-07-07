import "./profile.css"
import ProfileDropdown from "./profile.dropdown";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

const ProfileAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const handleClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const avatarUrl = user?.avatar_url ?? "/default-avatar.png";

  return (
    <div
      ref={containerRef}
      className="profile-container-wrapper"
    >
      <button className="profile-pic-btn" onClick={handleClick}>
        <img
          className="profile-pic-img"
          alt={user?.username ?? "Profile"}
          src={avatarUrl}
        />
        <span className="profile-username">{user?.username ?? "User"}</span>
      </button>
      <ProfileDropdown isOpen={isDropdownOpen} />
    </div>
  );
};

export default ProfileAvatar;