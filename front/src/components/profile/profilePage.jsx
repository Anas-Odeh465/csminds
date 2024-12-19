import React from "react";
import googleLogo from "../../assets/google.png";
import { FaFacebook, FaYoutube } from 'react-icons/fa';

function ProfilePage() {
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

  const coursesContainerStyle = {
    marginTop: "30px",
    color: "#000",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  };

  const coursesTitleStyle = {
    fontSize: "18px",
    marginBottom: "20px",
    fontWeight: "bold",
  };

  const coursesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  };

  const courseCardStyle = {
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const courseImageStyle = {
    width: "100%",
    borderRadius: "10px",
  };

  return (
    <>
      <div style={containerStyle}>
        <h1>Anas Odeh</h1>
        <h2>Learner at csminds</h2>
      </div>
      <div style={profileStyle}>
        <img src='' alt="user Image" style={imageStyle} />
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