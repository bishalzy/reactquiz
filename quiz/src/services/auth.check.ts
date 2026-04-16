import Endpoints from "../config/endpoints.config";
import { UserAuthData } from "../types/userdata.types";

const AuthCheck = async (): Promise<UserAuthData | null> => {
// TOdo send request to backend to check if user is authenticated and return the user data if authenticated
    const response = await fetch(Endpoints.checkauth, {
        method: "GET",
        credentials: "include"
    });
    if(response.status === 401){
        return null;
    }
    const userData = await response.json();
    console.log("User data from auth check:", userData);
    return userData;

}

export default AuthCheck;