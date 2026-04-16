import { getUserProfile } from "../services/user.api";
import { useEffect, useState } from "react";
import type {UserAuthData} from "../types/userdata.types";

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
    <div>
      <h1>Profile</h1>
      <h2>{userProfile?.username}</h2>
      <h2>{userProfile?.email}</h2>
      <img src={userProfile?.avatar_url ?? "/default-avatar.png"} alt="Profile" />
      <p>This is the profile page.</p>
    </div>
  );
};

export default Profile;