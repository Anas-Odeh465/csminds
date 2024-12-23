import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {UserAvatar_large}  from '../Profile/userAvat';


export default function EditProfilePage (){

    const [auth, setAuth] = useState(false);
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [headline, setHeadline] = useState('');
    const [biography, setBiography] = useState('');
    const [photo, setPhoto] = useState('');
    const [X, setX] = useState('');
    const [youtube, setYoutube] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [facebook, setFaceBook] = useState('');
    const [theNewPhoto, setTheNewPhoto] = useState('');

    const [showTempPic, setShowTempPic] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
        try {
            const res1 = await axios.get('http://localhost:3307');
            if (res1.data && res1.data.FirstName) {

                setAuth(true);

                // over the current data
                setFirstname(res1.data.FirstName);
                setLastname(res1.data.LastName);
                setEmail(res1.data.Email);
                setPhoto(res1.data.photo);
                setHeadline(res1.data.headline);
                setBiography(res1.data.biography);
                setX(res1.data.x);
                setYoutube(res1.data.youtube);
                setLinkedin(res1.data.linkedin);
                setFaceBook(res1.data.facebook);

            } else {
            
            const res2 = await axios.get('http://localhost:3307/api/users/to');
            if (res2.data && res2.data.user) {
                setAuth(true);
                setFirstname(res2.data.user.given_name);
                setLastname(res2.data.user.family_name);
                setEmail(res2.data.user.email);
                setPhoto(res2.data.user.send_photo_link);
            } else {
                setAuth(false);
            }
            
            }
        } catch (err) {
            console.error("Error fetching auth status:", err);
            setAuth(false);
        }
        };
    
        fetchAuthStatus();
    }, [auth]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setTheNewPhoto(URL.createObjectURL(file));
          const formData = new FormData();
          formData.append('photo', file);
          formData.append('email', email);
          setShowTempPic(formData);
        }
      };   
    
    
    const handelSaveButton = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3307/update/profile',
          [firstName,
            lastName,
            email,
            headline,
            biography,
            // showTempPic,
            X,
            youtube,
            linkedin,
            facebook]).then(res => {
            if(res.data === 'Profile updated successfully'){
                alert('Profile updated successfully');
            }
            else{
                alert('Failed to update profile');
            }
        }).catch(err => { console.log(err) });
        if (photo !== ''){
            axios.post('http://localhost:3307/upload',showTempPic)
            .then( res => {})
            .catch(er => console.log(er))
        }
    }

    console.log('Upload PICTURE:', `http://localhost:3307${photo}`);
    console.log('X : ', X);

    const fileInputStyle = {
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
      };

return (<>

{auth ? (<div className="bg-white py-16 w-screen mt-[80px] ml-[50px]">
    <h2 className="text-4xl font-bold text-gray-800 mb-4 px-4 text-left">
       Profile & settings 
       <hr className="border-0 h-1 bg-gray-800 w-5/4 mx-auto my-8 relative ml-[-1px]"/>
       
    </h2>
    <div className='ml-[60px] mt-[50px]'>
        
        {/* first name input */}
        <label htmlFor='First' className="block text-gray-700 font-semibold mb-2">First Name</label>
        <input
            id='First'
            type="text"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-2 border border-gray-600 rounded-md"
            style={{ width: '550px', outline: 'none' }}
        />

        {/* website input */}
        <label htmlFor="Website" className="ml-[40px] mt-[-32px] absolute left-100 text-gray-700 font-semibold z-0">
            Website
        </label>
        <input
            id='Website'
            type="text"
            placeholder="U"
            className="w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px]"
            style={{ width: '550px', outline: 'none' }}
            disabled
        />
        
        {/* last name input */}
        <label htmlFor='Last' className="block text-gray-700 font-semibold mb-2 mt-[20px]">Last Name</label>
        <input
            id='Last'
            type="text"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-2 border border-gray-600 rounded-md"
            style={{ width: '550px', outline: 'none' }} 
        />

        {/* X input */}
        <label htmlFor="X" className="ml-[40px] mt-[-32px] absolute left-100 text-gray-700 font-semibold z-0">
        X
        </label>
        <input
            id='X'
            type="text"
            value={X}
            onChange={(e) => setX(e.target.value)}
            placeholder="http://www.x.com/"
            className="w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px] "
            style={{ width: '550px', outline: 'none' }}
        />

        {/* headline input */}
        <label htmlFor='Headline' className="block text-gray-700 font-semibold mb-2 mt-[20px]">Headline Profile</label>
        <input
            id='Headline'
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Your Headline profile"
            className="w-full px-4 py-2 border border-gray-600 rounded-md"
            style={{ width: '550px', outline: 'none' }} 
        />

        {/* facebook input */}
        <label htmlFor="FaceBook" className="ml-[40px] mt-[-32px] absolute left-100 text-gray-700 font-semibold z-0">
           FaceBook
        </label>
        <input
            id='FaceBook'
            type="text"
            value={facebook}
            onChange={(e) => setFaceBook(e.target.value)}
            placeholder="http://www.facebook.com/"
            className="w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px]"
            style={{ width: '550px', outline: 'none' }}
        />

        {/* Hidden email input */}
        <input 
        type="email" 
        value={email}
        style={{ visibility: 'hidden'}}/>

        {/* biography input */}
        <label htmlFor='Biography' className="block text-gray-700 font-semibold mb-2 mt-[20px]">Biography Profile</label>
        <textarea 
            id='Biography'
            type="text"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            placeholder="Enter your story"
            className=" px-4 py-2 border border-gray-600 rounded-md"
            style={{ width: '550px',  resize: 'none', height: '200px', outline: 'none' }} 
        ></textarea>

        {/* LinkedIn input */}
        <label htmlFor="LinkedIn" className=" ml-[40px] mt-[-32px] absolute left-100 text-gray-700 font-semibold z-0">
        LinkedIn
        </label>
        <input
            id='LinkedIn'
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="http://www.linkedin.com/"
            className="ml-[40px] mt-[5px] absolute w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px]"
            style={{ width: '550px', outline: 'none' }}
        />

        {/* Youtube input */}
        <label htmlFor="Youtube" className=" ml-[40px] mt-[62px] absolute left-100 text-gray-700 font-semibold z-0">
        Youtube
        </label>
        <input
            id='Youtube'
            type="text"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="http://www.youtube.com/"
            className="ml-[40px] mt-[100px] absolute w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px]"
            style={{ width: '550px', outline: 'none' }}
        />

        {/* profile image input */}
        <label htmlFor="profileImage" className='block text-gray-700 font-semibold mb-2 mt-[20px]'>
        Profile Image
        </label>
        <input
            id="profileImage"
            type="file"
            name='photo'
            accept="image/*"
            onChange={handleImageChange}
            className="mr-[20px]"
            style={fileInputStyle}
        />
     

        { photo === 'No photo available' 
        ? (
           <UserAvatar_large firstName={firstName} />
        ) :
        'http://localhost:3307' + theNewPhoto !== `http://localhost:3307${photo}` 
        ? ( theNewPhoto === '' 
            ?(  
                <img src={`http://localhost:3307${photo}`} alt="Profile preview" 
                style={{ marginTop: '10px', width: '100px',
                height: '100px', borderRadius: '50%' }} />
             ): (
                <img src={theNewPhoto} alt="Profile preview" 
                style={{ marginTop: '10px', width: '100px',
                height: '100px', borderRadius: '50%' }} />
             ) 
        ) : (
            <img src={`http://localhost:3307${photo}`} alt="Profile preview" 
            style={{ marginTop: '10px', width: '100px',
            height: '100px', borderRadius: '50%' }} />
        )}
         
          
        
        {/* save button */}
        <button
            type="submit"
            onClick={handelSaveButton}
            className="w-full px-4 py-2 border border-gray-600 rounded-md 
                    bg-black text-white hover:bg-gray-800 mt-[20px]"
            style={{ width: '100px', outline: 'none' }}
        >
            Save
        </button>

    </div>
</div>) : (
    <div className="w-screen text-center  mt-[250px] mb-[260px] ">
        <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
            Access denied profile and settings
        </h2>
    </div>
)}
</>);
}