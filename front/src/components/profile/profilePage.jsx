import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaTimes, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { UserAvatar_large }  from '../Profile/userAvat';

function ProfilePage() {

  const [auth, setAuth] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [headline, setHeadline] = useState('');
  const [biography, setBiography] = useState('');
  const [X, setX] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFaceBook] = useState('');

  const navigate = useNavigate();
 
  

  axios.defaults.withCredentials = true;
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res1 = await axios.get('http://localhost:3307');
        
        if (res1.data && res1.data.FirstName) {
          setAuth(true);
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

  console.log("Final firstname:", firstname);
  console.log("Final lastname:", lastname);
  console.log("Final email:", email);

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    textAlign: "left",
    color: "#fff",
    background: "linear-gradient(to bottom, rgb(72, 101, 231) 90%, white 100%)",
    paddingTop: "130px",
    paddingLeft: "100px",
    paddingBottom: "30px",
    width: "105%",
    fontSize: "18px",
  };

  const profileStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingTop: "30px",
    marginBottom: "130px",
    marginLeft: "180px",

  };

  const imageStyle = {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    border: "3px solid #fff",
  };

  const descriptionContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    gap: "10px",
    marginLeft: "50px",
    marginTop: "30px",
  };

  const linksStyle = {
    display: "flex",
    position: "absolute",
    gap: "10px",
    marginTop: "180px",
    marginLeft:"8px",
  };


  return ( <>
   { auth ? 
    (<div> 
     <div style={containerStyle}>
        <h1>{firstname} {lastname}</h1>
        <h2>{headline}</h2>
      </div>

      <div style={profileStyle}>

      {photo == 'No photo available' ? (<UserAvatar_large firstName={firstname} />) : 
      ( <img src={`http://localhost:3307${photo}`} alt="profile picture" 
        style={imageStyle} title={firstname +" "+ lastname} />) }

        <div style={linksStyle}>

            {facebook ? <a href={facebook}>
              <FaFacebook size={20} style={{ color: 'blue' }}/>
            </a> : ('')}
            
            {youtube ? (<a href={youtube}>
              <FaYoutube size={20}  style={{ color: 'red' }}/>
            </a>) : ('')}

            {X ? (<a href={X}>
              <FaTimes size={20}  style={{ color: 'black' }}/>
            </a>) : ('')}

            {linkedin ? (<a href={linkedin}>
              <FaLinkedin size={20}  style={{ color: 'blue' }}/>
            </a>) : ('')}
          
        </div>

        <div style={descriptionContainerStyle}>
          <p>{biography}</p>
        </div>

      </div>
    </div>) : (<div className="w-screen text-center  mt-[250px] mb-[260px] ">
                  <h2 className="text-4xl font-bold text-gray-800 mt-[150px]">
                      Access denied profile and settings
                  </h2>
              </div>)
  }
  
  </>);
}

export default ProfilePage;
