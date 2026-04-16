import Endpoints from "../config/endpoints.config";
import { UserAuthData } from "../types/userdata.types";
import { refreshUserToken } from "./user.api";

const AuthCheck = async (): Promise<UserAuthData | null> => {
// TOdo send request to backend to check if user is authenticated and return the user data if authenticated
    const response = await fetch(Endpoints.checkauth, {
        method: "GET",
        credentials: "include"
    });
    if(response.status === 401){
         return null;
    }
    if(response.status === 498){
        console.warn("Token expired. Please log in again.");
        try {
            await refreshUserToken();

        } catch (error) {
            console.error("Error refreshing token:", error);
            return null;
        }

        const newResponse = await fetch(Endpoints.checkauth, {
            method: "GET",
            credentials: "include"
        });
        if (!newResponse.ok) {
            throw new Error("Failed to check auth after token refresh");
        }
        const refreshedUserData = await newResponse.json();
        console.log("User data after token refresh:", refreshedUserData);
        return refreshedUserData;
    }

    const userData = await response.json();
    console.log("User data from auth check:", userData);
    return userData;

}

export default AuthCheck;