import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import googleLogo from "../../assets/google.png";
import axios from 'axios';

function ProfilePage() {

  const [auth, setAuth] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');

  const navigate = useNavigate();
  const defaultImage = googleLogo;
 
  

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

  
  const photoUrl = photo ? photo : defaultImage;

  

  console.log("Final firstname:", firstname);
  console.log("Final lastname:", lastname);
  console.log("Final email:", email);
  console.log("Final photoUrl:", photoUrl);

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    textAlign: "left",
    color: "#fff",
    backgroundColor: "#646cff",
    paddingTop: "130px",
    paddingLeft: "100px",
    paddingBottom: "30px",
    width: "100%",
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
    marginLeft:"32px",
  };


  return (
    <>
      <div style={containerStyle}>
        <h1>{firstname} {lastname}</h1>
        <h2>Learner at csminds</h2>
      </div>

      <div style={profileStyle}>
        <img src={photoUrl} alt={photoUrl} style={imageStyle} title={firstname +" "+ lastname}/>
        <div style={linksStyle}>
          <a href="#">
             <FaFacebook size={20} />
          </a>
          <a href="#">
             <FaYoutube size={20}  style={{ color: 'red' }}/>
          </a>
        </div>

        <div style={descriptionContainerStyle}>

          <p>
            My name is Anas and I am 23 years old. I studied at Al Hussein Bin
            Talal University, specializing in computer information systems in
            bachelor's degree. I am learning on the Udemy platform and want to
            become an Instructor.
          </p>
          <p>
            I love programming because it makes me think logically, understand
            difficult problems, and analyze them based on the problems I face.
          </p> 
          
        </div>

      </div>
    </>
  );
}

export default ProfilePage;
