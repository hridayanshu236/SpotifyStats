import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart, faBars, faMusic, faSignOut, faX } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, DoughnutController, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, DoughnutController, CategoryScale, LinearScale, ArcElement);

const Dashboard = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [authenticated, setAuthenticated] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [timeRange, setTimeRange] = useState('short_term'); // default to 'short_term'
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const checkAuthStatus = async () => {
            try {
                console.log('Checking authentication status...');
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true });
                console.log('Authentication response:', response.data);
                if (response.data.authenticated) {
                    setAuthenticated(true);
                    setAccessToken(response.data.accessToken);
                } else {
                    setAuthenticated(false);
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
    
    useEffect(() => {
        if (!accessToken) return; // Prevent API calls if no access token

        const fetchData = async () => {
            try {
                const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserData(userResponse.data);

                // Fetch top tracks based on timeRange
                const tracksResponse = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setTopTracks(tracksResponse.data.items);

                // Fetch top artists based on timeRange
                const artistsResponse = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setTopArtists(artistsResponse.data.items);
            } catch (error) {
                console.error('Error fetching data from Spotify API:', error);
            }
        };

        fetchData();
    }, [accessToken, timeRange]);

    // Handle time range change
    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSignOut = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Prepare data for charts
    const topTracksData = {
        labels: topTracks.map(track => track.name),
        datasets: [
            {
                label: 'Streams',
                data: topTracks.map(track => track.popularity), // Use popularity or another metric
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const topArtistsData = {
        labels: topArtists.map(artist => artist.name),
        datasets: [
            {
                label: 'Followers',
                data: topArtists.map(artist => artist.followers.total), // Use followers count or another metric
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for Donut charts
    const topTracksDonutData = {
        labels: topTracks.map(track => track.name),
        datasets: [
            {
                data: topTracks.map(track => track.popularity), // Use popularity or another metric
                backgroundColor: topTracks.map((_, i) => `hsl(${i * 30}, 70%, 50%)`), // Different colors for each track
                borderWidth: 1,
            },
        ],
    };

    const topArtistsDonutData = {
        labels: topArtists.map(artist => artist.name),
        datasets: [
            {
                data: topArtists.map(artist => artist.followers.total), // Use followers count or another metric
                backgroundColor: topArtists.map((_, i) => `hsl(${i * 30}, 70%, 50%)`), // Different colors for each artist
                borderWidth: 1,
            },
        ],
    };

    if (authenticated === null) {
        return <div>Loading...</div>; // Handle loading state
    }

    return authenticated ? (
        <div className='flex min-h-screen bg-black'>
            {/* Sidebar Section */}
            {userData && (
                <div className={`fixed top-0 left-0 w-[250px] h-[100vh] bg-black text-white z-50 transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className='p-4'>
                        <FontAwesomeIcon icon={faX} onClick={toggleSidebar} className='cursor-pointer text-white' />
                    </div>
                    <div className='flex items-center justify-center mb-4 pt-4'>
                        <img
                            src={userData.images[0]?.url}
                            alt={userData.display_name}
                            className='w-32 h-32 rounded-full border-2 border-green-700 object-cover'
                        />
                    </div>
                    <div className='text-center mb-6 font-semibold'>
                        <h2 className='text-green-700 text-xl'>{userData.display_name}</h2>
                    </div>
                    <div className='flex flex-col font-semibold'>
                        <button className='text-white p-2 rounded hover:text-green-500' onClick={handleSignOut}>
                            <FontAwesomeIcon icon={faSignOut} /> Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Dashboard */}
            <div className='flex flex-col w-full bg-white p-4'>
                {/* Sidebar Toggle Button */}
                <div className='flex justify-between items-center'>
                    <h2 className='text-green-700 text-2xl p-4 font-bold'>
                        <FontAwesomeIcon icon={faBars} onClick={toggleSidebar} className='cursor-pointer text-black' /> MY DASHBOARD
                    </h2>
                </div>

                <div className='flex flex-row p-3'>
                    <div>
                        <label htmlFor='time-range' className='block text-black mb-2'>Select Time Range:</label>
                        <select id='time-range' value={timeRange} onChange={handleTimeRangeChange} className='p-2 border border-green-700 rounded'>
                            <option value='short_term'>Past Month</option>
                            <option value='medium_term'>Past 6 Months</option>
                            <option value='long_term'>All Time</option>
                        </select>
                    </div>
                </div>

                <div className='flex flex-col p-3 space-y-6'>
                    {/* Top Tracks Card */}
                    <div className='flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg'>
                        <div>
                            <h3 className='text-green-700 text-xl font-bold mb-4 block text-center'>Top Tracks</h3>
                        </div>
                        <div className='flex flex-col md:flex-row'>
                            <div className='w-full md:w-1/2 p-2'>
                                <Bar data={topTracksData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Top Tracks' } } }} />
                            </div>
                            <div className='w-full md:w-1/2 p-2'>
                                <Doughnut data={topTracksDonutData} options={{ responsive: true, plugins: { legend: { display: true }, title: { display: true, text: 'Top Tracks Distribution' } } }} />
                            </div>
                        </div>
                    </div>

                    {/* Top Artists Card */}
                    <div className='flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg'>
                        <div>
                            <h3 className='text-green-700 text-xl font-bold mb-4 block text-center'>Top Artists</h3>
                        </div>
                        <div className='flex flex-col md:flex-row'>
                            <div className='w-full md:w-1/2 p-2'>
                                <Bar data={topArtistsData} options={{ responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Top Artists' } } }} />
                            </div>
                            <div className='w-full md:w-1/2 p-2'>
                                <Doughnut data={topArtistsDonutData} options={{ responsive: true, plugins: { legend: { display: true }, title: { display: true, text: 'Top Artists Distribution' } } }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>Loading...</div> // Handle unauthenticated state
    );
};

export default Dashboard;
