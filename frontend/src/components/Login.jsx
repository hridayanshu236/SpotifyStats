import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from '@fortawesome/free-brands-svg-icons'; // Import the Spotify icon

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3001/auth/login';
    };

    return (
        <div className='min-h-[100vh] flex flex-col bg-black text-center items-center'>
            <div className='flex items-center justify-center text-white p-4 text-3xl'>
                <h1>
                    <FontAwesomeIcon icon={faSpotify} className='text-white mr-2' /> {/* Use the Spotify icon */}
                    Spotify Stats
                </h1>
            </div>
            <div className='flex flex-col  justify-center items-center p-3 min-h-[80vh] min-w-[80vh] pt-5'>
                <div className='inline-block text-white p-3'>
                    <h1 className='text-2xl'>Login to Spotify</h1>
                </div>
                <div className='items-center text-center p-4'>
                <button onClick={handleLogin} className='p-2  text-white border rounded-md bg-green-600'>
                    Login with Spotify
                </button>
                </div>
                
            </div>

        </div>
    );
};

export default Login;
