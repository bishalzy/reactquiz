const Endpoints = {
    fetchQuestions: `${import.meta.env.VITE_API_URL}/api/questions`,
    githubLogin: `${import.meta.env.VITE_API_URL}/auth/github/login`,
    checkauth: `${import.meta.env.VITE_API_URL}/user/me`,
    logout: `${import.meta.env.VITE_API_URL}/user/logout`,
    fetchUser: `${import.meta.env.VITE_API_URL}/user/profile`,
    gameHistory: `${import.meta.env.VITE_API_URL}/user/gamehistory`,
    refreshAccessToken: `${import.meta.env.VITE_API_URL}/auth/refresh`,
}


export default Endpoints;