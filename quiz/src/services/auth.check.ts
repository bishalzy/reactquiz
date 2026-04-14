import Endpoints from "../config/endpoints.config";

const AuthCheck = async () => {
// TOdo send request to backend to check if user is authenticated and return the user data if authenticated
    const response = await fetch(Endpoints.checkauth, {
        method: "GET",
        credentials: "include"
    });
    const userData = await response.json();
    return userData;

}

export default AuthCheck;