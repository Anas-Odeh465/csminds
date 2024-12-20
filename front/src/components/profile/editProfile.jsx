import React, { useState, useEffect } from 'react';



export default function EditProfilePage (){


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [headline, setHeadline] = useState('');
    const [biography, setBiography] = useState('');
    const [profileImage, setProfileImage] = useState(null);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfileImage(URL.createObjectURL(file));
      }
    };


    const fileInputStyle = {
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
      };

return (<>

<div className="bg-white py-16 w-screen mt-[80px] ml-[50px]">
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
            placeholder="http://www.x.com/"
            className="w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px] "
            style={{ width: '550px', outline: 'none' }}
        />

        {/* headline input */}
        <label htmlFor='Headline' className="block text-gray-700 font-semibold mb-2 mt-[20px]">Headline Profile</label>
        <input
            id='Headline'
            type="text"
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
            placeholder="http://www.facebook.com/"
            className="w-full px-4 py-2 border border-gray-600 rounded-md ml-[40px]"
            style={{ width: '550px', outline: 'none' }}
        />

        {/* biography input */}
        <label htmlFor='Biography' className="block text-gray-700 font-semibold mb-2 mt-[20px]">Biography Profile</label>
        <textarea 
            id='Biography'
            type="text"
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
            accept="image/*"
            onChange={handleImageChange}
            className="mr-[20px]"
            style={fileInputStyle}
        />
        {profileImage && <img src={profileImage} alt="Profile preview" 
        style={{ marginTop: '10px', width: '100px', height: '100px', 
        borderRadius: '50%' }} />}

        

        {/* save button */}
        <button
            type="submit"
            className="w-full px-4 py-2 border border-gray-600 rounded-md 
                    bg-black text-white hover:bg-gray-800 mt-[20px]"
            style={{ width: '100px', outline: 'none' }}
        >
            Save
        </button>

    </div>
</div>





</>);
 
}