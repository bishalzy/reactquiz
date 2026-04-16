import "./profile.css"
import ProfileDropdown from "./profile.dropdown";
import { useState, useRef, useEffect } from "react";

const ProfileAvatar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsDropdownOpen((prev) => !prev);
    console.log("Avatar clicked");
  };

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="profile-pic"
      onClick={handleClick}
    >
      <img
        className="profile-pic-img"
        alt="Profile"
        src={localStorage.getItem("avatar") ?? "/default-avatar.png"}
      />
      <ProfileDropdown isOpen={isDropdownOpen} />
    </div>
  );
};

export default ProfileAvatar;