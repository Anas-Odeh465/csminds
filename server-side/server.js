const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('./google-oauth');
require('dotenv').config();


const salt = 10;
const port = 3307;

const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
));

app.use(express.json());
app.use(cookie());

const connection = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME
});

// check this command (netstat -ano | findstr :3306) on terminal 

/* google sign up */ 

function isLoggedIn(req, res, next) {
   req.user ? next() : res.sendStatus(401);
}
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: [ 'email', 'profile' ] }
  ));
  
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure',
}),
(req, res) => {
    res.redirect(`/protected`);
}
);

app.get('/protected', isLoggedIn,(req, res) => {
    if (req.isAuthenticated()) {
        console.log("data found: ",req.user.given_name,  req.user.family_name, req.user.email);

        const token = jwt.sign({ firstName: req.user.given_name, 
        lastName:req.user.family_name, email:req.user.email },'secretkey', { expiresIn: '1d' });
        
        res.cookie('token', token);
        console.log("Cookie token: ", token);
        
        res.redirect('http://localhost:5173');
        

    } else {
      return res.json("An error occurred. Please try again");
    }
  });

  app.get('/api/users/to', (req, res) => {
        const { given_name, family_name, email } = req.user;  
        console.log('setIT', given_name, family_name, email);  
        
        return res.json({
            firstName: given_name,
            lastName: family_name,
            email: email,
        });
  });

/* google end point */  

const verfiyUser = (req, res, next) => {
    const tokens = req.cookies.token;
    if (!tokens) {
        return res.status(401).json({ Error: "No token provided" });
    }
    jwt.verify(tokens, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ Error: "Invalid or expired token" });
        }
        req.firstname = decoded.firstName;
        req.lastname = decoded.lastName;
        req.email = decoded.email;
        next();
    });
};


app.get('/', verfiyUser, (req, res) =>{
    return res.json({
        Status: "User authenticated successfully",
        FirstName: req.firstname,
        LastName: req.lastname,
        Email: req.email || 'No email available'
    });
})



app.post('/create-account', (req, res) => {

    console.log("Create account have: ", req.body);
    const { firstname, lastname, email, password } = req.body;
    const verification_status = "invalid";

    const checkUser = `SELECT * FROM registerd_user WHERE email = '${req.body.email}' `;
    connection.query(checkUser, [email],  (err, result) => {
        if (err) {
            return res.json("Error: " + err);
        }
        if(result.length > 0){
            return res.json("Email already exists");
        }
        else{
            bcrypt.hash(password.toString(), salt, (err, hash) => {
                if (err){return res.json({Error: "Error: while hashing password -> " + err})}
                const sql_statement = `INSERT INTO registerd_user (FirstName, LastName, email, password, verification_state) 
                VALUES(?)`;
                const values = [
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hash,
                    verification_status
                ];

                console.log(values);

                connection.query(sql_statement, [values], (err, data) =>{
                    if (err){
                        return res.json("Error: " + err);
                    }
                    else{
                    }
                    return res.json("User registered successfully!"); 
                });
            });
        }
    });  
});

app.post('/verify-email-account', (req, res) => {
    
    const verification_status = "Not Verifyed User";
    const email = req.body.email;
    console.log("verify email account have: ", email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const checkemail = `SELECT email FROM registerd_user WHERE email = '${email}'`;
    connection.query(checkemail, [email], (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

            const mailOptions = {
                from: 'csminds0101@gmail.com', 
                to: email,  
                subject: 'Verify your email',
                text: `Your verification code is: ${verificationCode}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Failed to send email' });
                }
                
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Verification code sent', code: verificationCode });
            });

            const check_if_code_exists = `SELECT verification_code FROM registerd_user WHERE email =?`;

            connection.query(check_if_code_exists, email, (err, data) =>{
                if (err){
                    return res.json("Error: " + err);
                }
                if(data.length > 0){
                    const update_code = `UPDATE registerd_user SET verification_code = ? , verification_state = ? WHERE email =?`;
                    connection.query(update_code, [verificationCode, verification_status, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
                else{
                    const insert_code = `INSERT INTO registerd_user (verification_code, verification_state) VALUES(?) WHERE email = ?`;
                    connection.query(insert_code, [verificationCode, verification_status, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
            });
        }
        else{
            return res.json("Email not found!!!");
        }
    });                
                    
});

app.post('/login', (req, res) => {
    console.log("Request body: " + req.body.email + " | " + req.body.password);
    const {email, password } = req.body;

    const checkUser_exist = `SELECT * FROM registerd_user WHERE 
    email = '${email}'`;

    connection.query(checkUser_exist, [email], (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            bcrypt.compare(password.toString(), data[0].password, (err, response) =>{
                if (err){
                    return res.json("Error: " + err);
                }
                if(response){
                    const firstName = data[0].FirstName;
                    const lastName = data[0].LastName;

                    const token = jwt.sign({ firstName, lastName, email },'secretkey', { expiresIn: '1d' });
                    res.cookie('token', token);
                    console.log("Cookie token: ", token);
                    return res.json(`Welcome ${firstName} ${lastName}`);
                }
                else{
                    return res.json("Invalid email or password");
                }
            });
            
        }
        else{
            return res.json("Invalid email or password");
        }
    });
});


app.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax', 
        secure: false,   
    });
    return res.json({ Status: 'Logged out successfully' });
});


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: 'ssl', 
    auth: {
      user: 'csminds0101@gmail.com', 
      pass: 'nbpdtykphjlabldl'  
    },
  });

app.post('/forgot-password',(req, res) => {

    const { email } = req.body;
    console.log("Forgot Password have: ", email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const checkemail = `SELECT email FROM registerd_user WHERE email = '${email}'`;
    connection.query(checkemail, [email], (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

            const mailOptions = {
                from: 'csminds0101@gmail.com', 
                to: email,  
                subject: 'Reset Password',
                text: `Your verification code is: ${verificationCode}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Failed to send email' });
                }
                
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Verification code sent', code: verificationCode });
            });

            const check_if_code_exists = `SELECT verification_code FROM registerd_user WHERE email =?`;

            connection.query(check_if_code_exists, email, (err, data) =>{
                if (err){
                    return res.json("Error: " + err);
                }
                if(data.length > 0){
                    const update_code = `UPDATE registerd_user SET verification_code = ? WHERE email =?`;
                    connection.query(update_code, [verificationCode, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
                else{
                    const insert_code = `INSERT INTO registerd_user (verification_code) VALUES(?)`;
                    connection.query(insert_code, [verificationCode], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
            });
        }
        else{
            return res.json("Email not found!");
        }
    });
});

app.post('/checkCode', (req, res) => {
    const { code, email } = req.body; 

    console.log( "Check Code for reset password have: ", code, email);
   
    const emailObject = email;
    const Email_only = emailObject.email;

    if (!email || !code) {
        return res.json("Missing email or code");
    }

    const check_email_user_AND_code = `SELECT verification_code FROM registerd_user WHERE email='${Email_only}'`;
    connection.query(check_email_user_AND_code, (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            if(data[0].verification_code === code){
                return res.json("Verification successful");
            }
            else{
                return res.json("Invalid verification code");
            }
        }
        else{
            return res.json("Email not found");
        }
    });
});


app.post('/checkCode2', (req, res) => {
    const { code, email } = req.body; 
    const verification_status = "Verifyed User";  

    console.log("Check Code 2 (For verify account) reset password have: ", code, email);
    console.log("Code Checked :(", req.body[0], ")--> Email checked :[", req.body[1],"]");
    console.log("Accepted :", req.body, " -> True");

    const emailIndex = req.body[1];
    const codeIndex = req.body[0];
   
    if (!emailIndex || !codeIndex) {
        return res.json("Missing email or code");
    }
    else{
        const check_email_user_AND_code = `SELECT verification_code FROM registerd_user WHERE email='${emailIndex}'`;
        connection.query(check_email_user_AND_code, (err, data) =>{
            if (err){
                return res.json("Error: " + err);
            }
            if(data.length > 0){
                if(data[0].verification_code === codeIndex){
                    const GET_verify = `UPDATE registerd_user SET verification_state = ? WHERE email = ?`;
                    connection.query(GET_verify, [verification_status, emailIndex], (err, data) => {
                        if (err){
                            return res.json("Error: " + err);
                        }
                        else{
                            return res.json('Email verified');
                        }
                    });
                }
                else{
                    return res.json("Invalid verification code");
                }
            }
            else{
                return res.json("Email not found");
            }
        });
    }
});

app.post('/reset-password', (req, res) => {
    const { email, password} = req.body;
    console.log(email, password);

    const ZIPemail = email;
    const XTRemail = ZIPemail.email;

    const check_email_for_password = `SELECT password FROM registerd_user WHERE email=?`;

    connection.query(check_email_for_password, [XTRemail], (err, data) => {
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            bcrypt.hash(password.toString(), salt, (err, hash) => {

                if (err){return res.json({Error: "Error: while hashing password -> " + err})}

                const update_password = `UPDATE registerd_user SET password =? WHERE email =?`;
                connection.query(update_password, [hash, XTRemail], (err, data) =>{
                    if (err){
                        return res.json("Error: " + err);
                    }
                    else{
                        return res.json("Password updated successfully");
                    }
                });
            });
        }
        else{
            return res.json("Email not found");
        }
    });
});

app.listen(port, () => {
    console.log('Server is running at port', port);
});



