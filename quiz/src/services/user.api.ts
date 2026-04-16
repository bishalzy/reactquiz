import Endpoints from "../config/endpoints.config";

export const getUserProfile = async () => {
    try {
        const response = await fetch(Endpoints.fetchUser, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const getGameHistory = async () => {
    try {
        const response = await fetch(Endpoints.gameHistory, {
            method: "GET",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch game history");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching game history:", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetch(Endpoints.logout, {
            method: "POST",
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to logout");
        }
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};