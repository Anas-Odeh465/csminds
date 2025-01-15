import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, StarIcon, PercentDiamondIcon,  CodeIcon, Send } from 'lucide-react';
import axios from 'axios';

export default function LoginAdmin(){
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3307/api/ADMINlogin', {username, password})
       .then((response) => {
            if(response.data.success){
                navigate('/adminPage');
            } else {
                alert(response.data.message);
            }
        })
       .catch((error) => {
            console.error('Error:', error);
            setError('Error connecting to the server.');
        });
    };

    return(
        <div className='min-h-screen w-screen flex flex-col items-center mt-36'>
            <div><Users/>
                <h1 className='text-5xl font-bold text-gray-800'>CS Minds</h1>
                <h2 className='text-2xl text-gray-500'>Login as Admin</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input 
                        type='text'
                        placeholder='Username'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type='password'
                        placeholder='Password'
                        className='w-full p-4 border border-gray-300 rounded-md mt-4'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type='submit' className='w-full p-4 bg-blue-600 text-white rounded-md mt-4'>Login</button>
                </form>
            </div>
        </div>
    );
}
