const passport = require('passport');
const express = require('express');
const mysql = require('mysql');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();


// (DataBase) connection and add -> 
const connection = mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3307/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {

  const passed = 'Google-Account';
  const verification_status = "Verifyed User";
  const { given_name, family_name, email} = profile;

  const check_user_exist = `SELECT * FROM registerd_user WHERE email=?`;
  connection.query(check_user_exist,[email], (err, result) => {
    if(err) {
      console.log("result: [", result, "]",err);
      return done(err);
    }
    else if(result.length > 0) {
      return done(null, profile);
    }
    else{
      const Query = `INSERT INTO registerd_user (FirstName, LastName, email, password, verification_state)
      VALUES (?, ?, ?, ?, ?)`;

      connection.query(Query, [given_name, family_name, email, passed, verification_status], (err, result) => {
        if (err) {
          console.log("Error inserting new user:", err);
          return done(err);
        } else {
          console.log('User inserted into database');
          return done(null, profile);
        }
      });
    }
  });
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
