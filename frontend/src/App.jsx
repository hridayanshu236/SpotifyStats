const DashboardWrapper = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true });
        setAuthenticated(response.data.authenticated);
        if (response.data.authenticated) {
          setAccessToken(response.data.accessToken);
        } else {
          navigate('/'); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthenticated(false);
        navigate('/'); // Redirect to login on error
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Dashboard accessToken={accessToken} /> : <Login />;
};
