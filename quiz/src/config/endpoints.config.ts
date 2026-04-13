const Endpoints = {
    fetchQuestions: `${import.meta.env.VITE_API_URL}/api/questions`,
    githubLogin: `${import.meta.env.VITE_API_URL}/auth/github/login`,
    checkauth: `${import.meta.env.VITE_API_URL}/auth/me`,
}


export default Endpoints;