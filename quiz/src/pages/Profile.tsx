import { getUserProfile } from "../services/user.api";
import { useEffect, useState } from "react";
import type { UserAuthData } from "../types/userdata.types";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserAuthData | null>(null);
  // const [gameHistory, setGameHistory] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // const fetchGameHistory = async () => {
    //   try {
    //     const history = await getGameHistory();
    //     setGameHistory(history);
    //   } catch (error) {
    //     console.error("Error fetching game history:", error);
    //   }
    // };

    fetchUserProfile();
    // fetchGameHistory();
  }, []);


  return (
    <div className="profile-container">
      <div className="profile-info">
        <img
          className="profile-avatar"
          src={userProfile?.avatar_url ?? "/default-avatar.png"}
          alt="Profile"
        />
        <div className="profile-meta">
          <h2>{userProfile?.username ?? "Guest User"}</h2>
          <p>{userProfile?.email ?? "No email available"}</p>
        </div>
      </div>
      <div className="game-history">
        <h1>Game History</h1>
        <p>Game history will be displayed here.</p>
      </div>

    </div>
  );
};
export default Profile;