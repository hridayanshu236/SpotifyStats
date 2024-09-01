import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarChart, faMusic, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ accessToken }) => {
    const [userData, setUserData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserData(userResponse.data);

                const tracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setTopTracks(tracksResponse.data.items);
            } catch (error) {
                console.error('Error fetching data from Spotify API:', error);
            }
        };

        fetchData();
    }, [accessToken]);

    return (
        <div className='flex min-h-screen bg-black'>
            {/* Sidebar Section */}
            {userData && (
                <div className='flex flex-col h-[full]  bg-black text-white p-4 mb-4'>
                    <div className='flex items-center justify-center mb-4'>
                        <img
                            src={userData.images[0]?.url}
                            alt={userData.display_name}
                            className='w-32 h-32 rounded-full border-2 border-green-700 object-cover'
                        />
                    </div>
                    <div className='text-center mb-6 font-semibold'>
                        <h2 className='text-green-700 text-xl'>{userData.display_name}</h2>
                    </div>
                    <div className='flex flex-col font-semibold '>
                        
                        <button className=' text-white p-2  rounded hover:text-green-500'>
                        <FontAwesomeIcon icon={faBarChart}></FontAwesomeIcon> Dashboard
                        </button>
                        <button className=' text-white p-2 rounded hover:text-green-500'>
                        <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon> Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Section */}
            <div className='flex flex-col w-full  bg-white p-4'>
                <h2 className='text-black text-2xl mb-4'>Your Top Tracks</h2>
                <ul>
                    {topTracks.map(track => (
                        <li key={track.id} className='flex items-center py-2 border-b'>
                            <FontAwesomeIcon icon={faMusic} className='text-black mr-2' />
                            <span className='font-semibold'>{track.name}</span> - <span>{track.artists[0].name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
