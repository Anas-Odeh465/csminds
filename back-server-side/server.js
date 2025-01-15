const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('./google-oauth');
const multer = require('multer');
const path = require('path');
require('dotenv').config();


const salt = 10;
const port = 3307;

const app = express();
app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://localhost', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    const email = req.email;
    const sql_statement = `SELECT * FROM registerd_user WHERE email =?`;
    connection.query(sql_statement, [email], (err, result) => {
        if (err) {
            return res.json("Error: " + err);
        }
        if(result.length > 0){
            return res.json({
                Status: "User authenticated successfully",
                FirstName: req.firstname,
                LastName: req.lastname,
                Email: req.email || 'No email available',
                photo: result[0].profileImage || 'No photo available',
                headline: result[0].headline  ,
                biography: result[0].biography ,
                x: result[0].X ,
                youtube: result[0].youtube ,
                linkedin: result[0].linkedin ,
                facebook: result[0].facebook
            });
        }
        else{
            res.json("User not found");
        }
    });    
})

app.get('/check=instructors', (req, res) => {
    const { email } = req.query;
    console.log("check=instructors: ",email);
    const corsQUERY = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(corsQUERY, [email], (err, result) => {
        if (err) {
            return res.json("Error: " + err);
        }
        if(result.length > 0){
            const userID = result[0].id;
            const query = `SELECT * FROM instructors WHERE user_ID=?`;
            connection.query(query, [userID], (err, result) => {
                if (result.length > 0 && result[0].user_ID != null) {
                    return res.json("found instructor");
                }
            });
        }
        else{
            res.json("User not found");
        }
    });
});


const htmlTemplate = fs.readFileSync('email-template.HTML', 'utf8');
const template = handlebars.compile(htmlTemplate);


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
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    console.log("verify email account have: ", email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const checkemail = `SELECT * FROM registerd_user WHERE email = '${email}'`;
    connection.query(checkemail, [email], (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

            const emailData = {
                name: `${data[0].FirstName + " " + data[0].LastName}`,
                verification: `${verificationCode}`
            };

            const htmlToSend = template(emailData);
            const mailOptions = {
                from: 'csminds0101@gmail.com', 
                to: email,  
                subject: 'Verify your email',
                text: `Your verification code is: ${verificationCode}`,
                html: htmlToSend,
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
                    const update_code = `UPDATE registerd_user SET verification_code = ? , verification_state = ?, code_expiry=? WHERE email =?`;
                    connection.query(update_code, [verificationCode, verification_status, expiresAt, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
                else{
                    const insert_code = `INSERT INTO registerd_user (verification_code, verification_state, code_expiry) VALUES(?,?,?) WHERE email = ?`;
                    connection.query(insert_code, [verificationCode, verification_status, expiresAt, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email + " The code expire after 3 minutes");
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
            if(data[0].verification_state === 'Verifyed User'){
                bcrypt.compare(password.toString(), data[0].password, (err, response) =>{
                    if (err){
                        return res.json("Error: " + err);
                    }
                    if(response){
                        const firstName = data[0].FirstName;
                        const lastName = data[0].LastName;
    
                        const token = jwt.sign({ firstName, lastName, email },'secretkey', { expiresIn: '10d' });
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
                return res.json("Invalid Email!");
            } 
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

const htmlTemplate_pass = fs.readFileSync('password-template.HTML', 'utf8');
const template_2 = handlebars.compile(htmlTemplate_pass);

app.post('/forgot-password',(req, res) => {

    const { email } = req.body;
    console.log("Forgot Password have: ", email);
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const checkemail = `SELECT * FROM registerd_user WHERE email = '${email}'`;
    connection.query(checkemail, [email], (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

            const emailData = {
                name: `${data[0].FirstName + " " + data[0].LastName}`,
                verification: `${verificationCode}`
            };

            const htmlToSend = template(emailData);

            const mailOptions = {
                from: 'csminds0101@gmail.com', 
                to: email,  
                subject: 'Reset Password',
                text: `Your verification code is: ${verificationCode}`,
                html: htmlToSend
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ error: 'Failed to send email' });
                }
                
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Verification code sent', code: verificationCode });
            });

            const check_if_code_exists = `SELECT * FROM registerd_user WHERE email =?`;

            connection.query(check_if_code_exists, email, (err, data) =>{
                if (err){
                    return res.json("Error: " + err);
                }
                if(data.length > 0){
                    const update_code = `UPDATE registerd_user SET verification_code = ?, code_expiry=? WHERE email =?`;
                    connection.query(update_code, [verificationCode, expiresAt, email], (err, data) =>{
                        if (err){
                            return res.json("Error: " + err);
                        }
                        return res.json("Verification sent to " + email);
                    });
                }
                else{
                    const insert_code = `INSERT INTO registerd_user (verification_code, code_expiry) VALUES(?,?)`;
                    connection.query(insert_code, [verificationCode, expiresAt], (err, data) =>{
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

    const check_email_user_AND_code = `SELECT * FROM registerd_user WHERE email='${Email_only}'`;
    connection.query(check_email_user_AND_code, (err, data) =>{
        if (err){
            return res.json("Error: " + err);
        }
        if(data.length > 0){
            if(data[0].verification_code === code){
                const expiresAt = new Date(data[0].code_expiry);
                const now = new Date();
                if (now > expiresAt) {
                    return res.json('Verification code expired.');
                } else {
                    return res.json("Verification successful");
                }
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
        const check_email_user_AND_code = `SELECT * FROM registerd_user WHERE email='${emailIndex}'`;
        connection.query(check_email_user_AND_code, (err, data) =>{
            if (err){
                return res.json("Error: " + err);
            }
            const expiresAt = new Date(data[0].code_expiry);
            const now = new Date();
            if(data.length > 0){
                if(data[0].verification_code === codeIndex){
                    if (now > expiresAt) {
                        return res.json("THE verification code is Expired!");
                    }
                    else {
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

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./uploads/Images")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
})
  
const upload = multer({storage})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

app.post('/upload', upload.single('photo'), (req, res) => {
    console.log('body: ',req.body)
    console.log('email: ',req.body.email)
    console.log('file: ',req.file) 

    const imagePath = `/uploads/Images/${req.file.filename}`;
    console.log('email request found : ', req.email)
    const check_if_picture = `SELECT profileImage FROM registerd_user WHERE email=?`;
    
    connection.query(check_if_picture, [req.body.email], (err, data) => {
        if (err){
            return res.json("Error: " + err);
        }
        else if(data.length > 0){
            const update_picture = `UPDATE registerd_user SET profileImage =? WHERE email =?`;
            connection.query(update_picture, [imagePath, req.body.email], (err, data) =>{
                if (err){
                    console.log("Error: " + err);
                }
                else{
                    console.log("Profile picture updated successfully", imagePath);
                }
            });
        }
        else{
            // here insert the picture into the database if the user not has already uploaded picture 
            const insert_picture = `INSERT INTO registerd_user (profileImage) VALUES(?) WHERE email=?`;
            connection.query(insert_picture, [imagePath, req.body.email], (err, data) =>{
                if (err){
                    console.log("Error: " + err);
                }
                else{
                    console.log("Profile picture inserted successfully", imagePath);
                }
            });
        }
    });
})

app.post('/update/profile', (req, res) => {
    let {firstName, lastName, email, headline, biography, X, youtube, linkedin, facebook } = req.body;

    console.log(`Server got information to update profile from ${email}: `, {
        firstName, lastName, headline, biography, X, youtube, linkedin, facebook
    });

    firstName = req.body[0];
    lastName = req.body[1];
    email = req.body[2];
    headline = req.body[3];
    biography = req.body[4];
    X = req.body[5];
    youtube = req.body[6];
    linkedin = req.body[7];
    facebook = req.body[8];

    const checkProfile = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(checkProfile, [email], (err, data) => {
        if (err) {
            return res.json("Error: " + err);
        }
        
        if (data.length > 0) {
            const user_ID = data[0].id;
            const updateProfile = `UPDATE registerd_user SET FirstName=?, LastName=?, headline=?, biography=?, X=?, youtube=?, linkedin=?, facebook=? WHERE email=?`;
            connection.query(updateProfile, [firstName, lastName, headline, biography, X, youtube, linkedin, facebook, email], (err) => {
                if (err) {
                    return res.json("Error: " + err);
                }

                // Check if the user is an instructor and update instructor name
                const fullName = `${firstName} ${lastName}`;
                const checkIfInstructor = `SELECT * FROM instructors WHERE user_ID=?`;
                connection.query(checkIfInstructor, [user_ID], (err, instructorData) => {
                    if (err) {
                        return res.json("Error checking instructor: " + err);
                    }

                    if (instructorData.length > 0) {
                        const updateInstructor = `UPDATE instructors SET instructor_name=? WHERE user_ID=?`;
                        connection.query(updateInstructor, [fullName, user_ID], (err) => {
                            if (err) {
                                return res.json("Error updating instructor: " + err);
                            }
                            return res.json("Profile updated successfully");
                        });
                    } else {
                        return res.json("Profile updated successfully");
                    }
                });
            });
        } else {
            return res.json("User not found");
        }
    });
});

app.post('/Instuctor/info', (req, res) => {
    const Name = req.body[0];
    const WorkEmail = req.body[1];
    const CS_Minds_Orginal_email = req.body[2];
    const Role = req.body[3];

    console.log(`Server got information to set instructor info from ${CS_Minds_Orginal_email}: `, {
        Name : Name,
        WorkEmail : WorkEmail,
        CS_Minds_Orginal_email : CS_Minds_Orginal_email,
        Role : Role,
    });

    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [CS_Minds_Orginal_email], (err, data) => {
        if (err){
            return res.json("Error: " + err);
        }
        else if (data.length > 0){
            const userID = data[0].id;
            const check_already_Instructor = `SELECT * FROM instructors WHERE user_ID=?`;
            connection.query(check_already_Instructor, [userID], (err, data) => {
                if (err){
                    return res.json("Error: " + err);
                }
                else if (data.length > 0){
                    return res.json("You are already Instructor");
                }
                else{
                    if (WorkEmail !== ''){
                        const Insert_Instructor = `INSERT INTO instructors 
                        (user_ID, instructor_name, work_Email, role) VALUES(?,?,?,?)`;
                        connection.query(Insert_Instructor, [userID, Name, WorkEmail, Role], (err, data) =>{
                            if (err){
                                return res.json("Error: " + err);
                            }
                            else{
                                return res.json("Instructor info inserted successfully");
                            }
                        });
                    }
                    else{
                        const Insert_Instructor = `INSERT INTO instructors 
                        (user_ID, instructor_name, work_Email, role) VALUES(?,?,?,?)`;
                        connection.query(Insert_Instructor, [userID, Name, CS_Minds_Orginal_email, Role], (err, data) =>{
                            if (err){
                                return res.json("Error: " + err);
                            }
                            else{
                                return res.json("Instructor info inserted successfully");
                            }
                        });
                    } 
                }
            });
        }
        else{
            return res.json("User not found");
        }
    })
    
})

const upload_video_picture = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const destination =
                file.fieldname === "video"
                    ? path.join(__dirname, "uploads/Videos")
                    : path.join(__dirname, "uploads/Images");
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
});

app.post("/uploads/course=video",upload_video_picture.fields([ { name: "video", maxCount: 1 },{ name: "coursePic", maxCount: 1 },]),(req, res) => {
    const email = req.body.email;
    const title = req.body.title;
    const language = req.body.language;
    const category = req.body.category;
    const level = req.body.level;
    const courses_requirements = req.body.prerequisites;
    const courses_outcomes = req.body.outcomes;
    const price = req.body.price;
    const description = req.body.description;
    const TotalTime = req.body.total_Time;

    console.log('\n================================\n');
    console.log('Request Data:', { email, title, category, level, courses_requirements, courses_outcomes, price, description, TotalTime, language });
    console.log("Uploaded Files:", req.files);

    if (!req.files) {
        return res.status(400).json({ error: "Video file is required" });
    }

    const videoPath = req.files.video ? `/uploads/Videos/${req.files.video[0].filename}` : null;
    const imagePath = req.files.coursePic ? `/uploads/Images/${req.files.coursePic[0].filename}`: null;

        console.log("Saved video path:", videoPath);
        console.log("Saved image path:", imagePath);

    const outcomeArray = Array.isArray(courses_outcomes) ? courses_outcomes : (typeof courses_outcomes === 'string' ? courses_outcomes.split(',') : []);
    if (outcomeArray.length > 4) {
        return res.status(400).json({ error: "A maximum of 4 courses_outcomes is allowed" });
    }
    const [outcome_1 = null, outcome_2 = null, outcome_3 = null, outcome_4 = null] = outcomeArray;

    const requirementArray = Array.isArray(courses_requirements) ? courses_requirements : (typeof courses_requirements === 'string' ? courses_requirements.split(',') : []);
    if (requirementArray.length > 4) {
        return res.status(400).json({ error: "A maximum of 4 courses_requirements is allowed" });
    }
    const [requirement_1 = null, requirement_2 = null, requirement_3 = null, requirement_4 = null] = requirementArray;

    const query = `
        SELECT r.id AS userID, i.user_ID AS instructorID
        FROM registerd_user r
        LEFT JOIN instructors i ON r.id = i.user_ID
        WHERE r.email = ?
    `;

    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.json("Error: " + err);
        }
        if (results.length === 0 || !results[0].instructorID) {
            return res.json("User not found or not an instructor");
        }
        const instructorID = results[0].instructorID;
        const insertQuery = `INSERT INTO courses 
            (user_courseID, course_level, course_title, course_category, video_course, course_picture, course_pricing, course_description, course_time, course_language)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery,[instructorID, level, title, category, videoPath, imagePath, price, description, TotalTime, language], (err, data) => {
            if (err) {
                return res.json("Error: " + err);
            }else{
                const query_2 = `SELECT ID_course_specifier FROM courses WHERE user_courseID = ? ORDER BY ID_course_specifier  DESC LIMIT 1`;
                connection.query(query_2, [instructorID], (err, data) => {
                    if(err){
                        return res.json("Error: " + err);
                    }
                    else{
                        const courseID = data[0].ID_course_specifier;
                        const insertcourses_outcomesQuery  = `INSERT INTO courses_outcomes 
                        (user_courseID, outcome_1, outcome_2, outcome_3, outcome_4, ID_course_specifier)
                            VALUES(?, ?, ?, ?, ?, ?)`;
                        connection.query(insertcourses_outcomesQuery, [instructorID, outcome_1, outcome_2, outcome_3, outcome_4, courseID], (err, data) => {
                            if(err){
                                return res.json("Error: " + err);
                            }
                            const insertcourses_requirementsQuery = `
                            INSERT INTO courses_requirements (user_courseID, requirement_1, requirement_2, requirement_3, requirement_4, ID_course_specifier)
                            VALUES (?, ?, ?, ?, ?, ?)
                            `;
                            connection.query(insertcourses_requirementsQuery, [instructorID, requirement_1, requirement_2, requirement_3, requirement_4, courseID], (err, courses_requirementsResult) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: "Failed to insert courses_requirements" });
                                }
                                else{
                                    return res.json("course uploaded successfully");
                                }
                            });
                        });
                    }
                });
            }
        });   
    });
});


app.get('/api/courses', (req, res) => {
    const courseId = req.query.idc;
    console.log('Course ID received:', courseId);

    const idccourseinstructor = req.query.idccourseinstructor;
    console.log('Instructor ID received:', idccourseinstructor);

    if (courseId) {
        const query = `
            SELECT courses.*, 
            CONCAT(registerd_user.FirstName, ' ', registerd_user.LastName) AS FullName, 
            registerd_user.profileImage AS profileImage,
            registerd_user.biography AS biography, 
            registerd_user.headline AS headline,
            registerd_user.facebook AS facebook,
            registerd_user.X AS X, 
            registerd_user.youtube AS youtube,
            registerd_user.linkedin AS linkedin,
            instructors.*, 
            courses_outcomes.*, 
            courses_requirements.*,
            (SELECT COUNT(*) 
            FROM courses 
            WHERE user_courseID = courses.user_courseID) AS record_course_count
            FROM courses
            INNER JOIN registerd_user 
                ON courses.user_courseID = registerd_user.id
            LEFT JOIN instructors 
                ON courses.user_courseID = instructors.user_ID
            LEFT JOIN courses_outcomes 
                ON courses.ID_course_specifier = courses_outcomes.ID_course_specifier
            LEFT JOIN courses_requirements 
                ON courses.ID_course_specifier = courses_requirements.ID_course_specifier
            WHERE courses.ID_course_specifier = ?; 
        `;
        connection.query(query, [courseId], (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.json("Failed to fetch courses");
            }
            if (results.length === 0) {
                console.log("No course found with ID:", courseId);
                return res.json("Course not found");
            } else {
                return res.json(results[0]);  
            }
        });
    }else if(idccourseinstructor){
        const query = `SELECT * FROM courses WHERE user_courseID =?`;
        connection.query(query, [idccourseinstructor], (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.json("Failed to fetch courses");
            }
            if (results.length === 0) {
                console.log("No courses found for instructor with ID:", idccourseinstructor);
                return res.json("No courses available for this instructor");
            } else {
                return res.json(results[0]);  
            }
        });
    } else {
        const query = `
            SELECT courses.*, CONCAT(registerd_user.FirstName, ' ', registerd_user.LastName) AS FullName
            FROM courses 
            INNER JOIN registerd_user 
            ON courses.user_courseID = registerd_user.id
        `;
        connection.query(query, (err, results) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Failed to fetch courses" });
            }
            if (results.length === 0) {
                console.log("No courses found");
                return res.status(404).json({ error: "No courses available" });
            } else {
                return res.json(results);  
            }
        });
    }
});

app.get('/api/myinsCourses', (req, res) =>{
    const instructorID = req.query.instructorId;
    const query = `
        SELECT courses.*, (SELECT COUNT(*) FROM courses WHERE user_courseID = ?) AS totalRecords FROM courses WHERE user_courseID = ?`;

    connection.query(query, [instructorID, instructorID], (err, results) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Failed to fetch courses" });
        }
        if (results.length === 0) {
            console.log("No courses found for instructor with ID:", instructorID);
            return res.status(404).json({ error: "No courses available for this instructor" });
        } else {
            return res.json(results);
        }
    });
})

app.post('/api/saveUserCart', (req, res) => {
    const courseId = req.body[0];
    const email = req.body[1];
    console.log('saveUserCart got: ', req.body);
    const query = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(query, [email], (err, data) => {
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            const userID = data[0].id;
            const insertCart = `INSERT INTO users_carts (user_ID, ID_course_specifier) VALUES(?, ?)`;
            connection.query(insertCart, [userID, courseId], (err, data) => {
                if (err) {
                    return res.json({ error: `Error: ${err}` });
                } else {
                    return res.json({ success: "Course added to cart successfully" });
                }
            });
        } else {
            return res.json({ error: "User not found" });
        }
    });
});

app.get('/api/getUserCart', (req, res) => {
    const email = req.query.vepwj;
    console.log('getUserCart: ', req.query);
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [email], (err, data) => { 
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            const userID = data[0].id;

            const getCartQuery = `
                SELECT c.*, i.instructor_name
                FROM users_carts uc
                JOIN courses c ON uc.ID_course_specifier = c.ID_course_specifier
                JOIN instructors i ON c.user_courseID = i.user_ID
                WHERE uc.user_ID = ?;
            `;

            connection.query(getCartQuery, [userID], (err, courses) => {
                if (err) {
                    return res.json({ error: `Error: ${err}` });
                } else if (courses.length > 0) {
                    return res.json({ 
                        courseCart: courses, 
                        totalCartsRecords: courses.length
                    });
                } else {
                    return res.json({ error: "No courses found in cart." });
                }
            });
        } else {
            return res.json({ error: "User not found" });
        }
    });
});

app.delete('/api/deleteCourseFromCart', (req, res) => {
    const email = req.query.Email;
    const courseID = req.query.CourseID;
    console.log('deleteCourseFromCart: ', req.query);
    if (!courseID || !email) {
        return res.status(400).json({ error: "Course ID and User ID are required" });
    }
    const query = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(query, [email], (err, data) => {
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            const userID = data[0].id;
            const deleteQuery = `DELETE FROM users_carts WHERE ID_course_specifier = ? AND user_ID = ?`;
            connection.query(deleteQuery, [courseID, userID], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: `Error: ${err}` });
                } else {
                    return res.json({ message: "Course removed successfully!" });
                }
            });
        }else{
            return res.json({ error: "Error" });
        }
    });
});

app.post('/api/postComment', (req, res) => {
    const courseId = req.body[0];
    const email = req.body[1];
    const comment = req.body[2];
    const commentScore = parseFloat(req.body[3]);  // Ensure score is treated as a number
    const fullName = req.body[4];
    const photo = req.body[5];

    console.log('Post Comment received:', req.body);
    
    const query_1 = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(query_1, [email], (err, data) => {
        if (err) {
            return res.json({ error: `Error fetching user: ${err}` });
        }
        
        if (data.length > 0) {
            const userID = data[0].id;
            const insertComment = `
                INSERT INTO cources_comments (user_ID, comment, ID_course_specifier, evaluation_scores, fullName, photo) 
                VALUES (?, ?, ?, ?, ?, ?)`;
            
            connection.query(insertComment, [userID, comment, courseId, commentScore, fullName, photo], (err) => {
                if (err) {
                    return res.json({ error: `Error inserting comment: ${err}` });
                }
                
                const sumQuery = ` SELECT SUM(evaluation_scores) AS totalScore FROM cources_comments WHERE ID_course_specifier = ?`;
                connection.query(sumQuery, [courseId], (err, result) => {
                    if (err) {
                        return res.json({ error: `Error calculating score: ${err}` });
                    }
                    
                    const totalScore = result[0].totalScore;
                    const updateScoreQuery = ` UPDATE courses SET course_evaluation = ? WHERE id_course_specifier = ?`;
                    connection.query(updateScoreQuery, [totalScore, courseId], (err) => {
                        if (err) {
                            return res.json({ error: `Error updating course score: ${err}` });
                        }
                        return res.json({ success: "Course evaluation updated successfully." });
                    });
                });
            });
        } else {
            return res.json({ error: "User not found" });
        }
    });
});

app.get('/api/get-global-messages', (req, res) => {
   const courseID = req.query.courseId;
   console.log('get-global-messages: ', req.query);
   const query = `SELECT * FROM cources_comments WHERE id_course_specifier=?`;
   connection.query(query, [courseID], (err, data) => {
     if(err){
         return res.json("Error: " + err);
     }
     else{
        console.log('comments data: ' + data);
         return res.json(data);
     }
   });
});   


app.post('/api/newStudentEnrolled', (req, res) => {
    const add_enrolled_state = 'enrolled';
    const add_student = 1;
    const email = req.body[0];
    const courseId = req.body[1];

    console.log('New Student Enrollment Request Received:', req.body);

    const query = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(query, [email], (err, data) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Error fetching user data." });
        }

        if (data.length === 0) {
            console.log("User not found.");
            return res.status(404).json({ error: "User not found" });
        }

        const updateEnrolledStatus = `UPDATE registerd_user SET student_enrolled_status =? WHERE email =?`;
        connection.query(updateEnrolledStatus, [add_enrolled_state, email], (err) => {
            if (err) {
                console.error("Error updating student enrollment status:", err);
                return res.status(500).json({ error: "Error updating enrollment status." });
            }

            const query_1 = `SELECT * FROM courses WHERE ID_course_specifier=?`;
            connection.query(query_1, [courseId], (err, InstructorData) => {
                if (err) {
                    console.error("Error fetching course data:", err);
                    return res.status(500).json({ error: "Error fetching course data." });
                }

                if (InstructorData.length === 0) {
                    console.log("Course not found.");
                    return res.status(404).json({ error: "Course not found" });
                }

                const instructorId = InstructorData[0].user_courseID;
                console.log("Instructor ID found:", instructorId);

                const getNumberLearners = `SELECT number_Learners FROM instructors WHERE user_ID=?`;
                connection.query(getNumberLearners, [instructorId], (err, result) => {
                    if (err) {
                        console.error("Error fetching number of learners:", err);
                        return res.status(500).json({ error: "Error fetching number of learners." });
                    }

                    if (result.length === 0) {
                        console.log("Instructor not found.");
                        return res.status(404).json({ error: "Instructor not found." });
                    }

                    const newNumberLearners = result[0].number_Learners + add_student;
                    const updateLearners = `UPDATE instructors SET number_Learners = number_Learners + ? WHERE user_ID = ?`;
                    
                    connection.query(updateLearners, [add_student, instructorId], (err, updateResult) => {
                        if (err) {
                            console.error("Error updating number of learners:", err);
                            return res.status(500).json({ error: "Error updating number of learners." });
                        }

                        if (updateResult.affectedRows > 0) {
                            console.log("Number of learners updated successfully:", newNumberLearners);
                            return res.json({ message: "Number of learners updated successfully." });
                        } else {
                            console.log("Update failed, no rows affected.");
                            return res.json({ error: "Instructor not updated properly." });
                        }
                    });
                });
            });
        });
    });
});


app.post('/api/save-message', (req, res) => {
    const  email  = req.body.email;
    const message = req.body.message;
    console.log(`save-message-system got: ${email}\n message: `, message);
    console.log('Query:', req.body);
    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [email], (err, data) => {
        if(err){
            return res.json("Error: " + err);
        }
        else if(data.length > 0){
            const userID = data[0].id;
            const insertID_and_message = `INSERT INTO ai_mind_recent_chat (user_ID, message) VALUES(?, ?)`;
            connection.query(insertID_and_message, [userID, message], (err, data) => {
                if(err){
                    return res.json({ error: `Error: ${err}` });
                }
                else{
                    return res.json({ success: "Message saved successfully" });
                }
            });
        }
        else{
            return res.json({ error: "User not found" });
        }
    });
});

app.post('/api/postLearn', (req, res) => {
    const courseID = req.body[0];
    const email = req.body[1];

    console.log(`postLearn got: ${courseID}\n email: `, email);

    const query = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(query, [email], (err, data) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.json({ error: "Error fetching user data." });
        } else if (data.length > 0) {
            const userID = data[0].id;
            const addLearn = `
                INSERT IGNORE INTO user_learning (user_ID, ID_course_specifier)
                VALUES (?, ?)`;     
            connection.query(addLearn, [userID, courseID], (err, data) => {
                if (err) {
                    console.error(err);
                    return res.json({ error: `Error: ${err}` });
                } else if (data.affectedRows === 0) {
                    return res.json("User already learned this course");
                } else {
                    console.log(`Successfully added`);
                    return res.json({ success: "User added learning course successfully" });
                }
            });
        } else {
            return res.json({ error: "User not found" });
        }
    });
});

app.get('/api/getLearn', (req, res) => {
    const email = req.query.email;
    console.log('get-learn: ', req.query);
    const query = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(query, [email], (err, data) => {
        if(err){
            return res.json("Error: " + err);
        }
        else if(data.length > 0){
            const userID = data[0].id;
            const getLearnQuery = `SELECT * FROM user_learning WHERE user_ID=?`;
            connection.query(getLearnQuery, [userID], (err, data) => {
                if(err){
                    return res.json({ error: `Error: ${err}` });
                }
                else{
                    return res.json(data);
                }
            });
        }
        else{
            return res.json({ error: "User not found" });
        }
    });
});

app.post('/api/get-messages', (req, res) => {
    const email = req.body.email;

    console.log('get-messages: ', req.body);
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [email], (err, data) => {
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            const userID = data[0].id;
            const getMessagesQuery = `SELECT message FROM ai_mind_recent_chat WHERE user_ID=?`;
            connection.query(getMessagesQuery, [userID], (err, messages) => {
                if (err) {
                    return res.json({ error: `Error: ${err}` });
                } else {
                    console.log('Messages from connection:', messages); 
                    const allMessages = messages.map(message => message.message);
                    console.log('All messages array:', allMessages);  
                    return res.json({ allMessages });
                }
            });
        } else {
            return res.json({ error: "User not found" });
        }
    });
});

app.post('/api/removeMessages', (req, res) => {
    const email = req.body.Global_email;
    const message = req.body.messageToRemove;
    console.log(`delete-message-system got: ${email}\n message: `, message);
    console.log('Query:', req.body);
    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [email], (err, data) => {
        if(err){
            return res.json("Error: " + err);
        }
        else if(data.length > 0){
            const userID = data[0].id;
            const insertID_and_message = `DELETE FROM ai_mind_recent_chat WHERE user_ID=? AND message=?`;
            connection.query(insertID_and_message, [userID, message], (err, data) => {
                if(err){
                    return res.json({ error: `Error: ${err}` });
                }
                else{
                    return res.json({ success: "Message removed successfully" });
                }
            });
        }
        else{
            return res.json({ error: "User not found" });
        }
    });
})

app.get('/api/usersCheckINS', (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const checkID = `SELECT id FROM registerd_user WHERE email=?`;
    connection.query(checkID, [email], (err, data) => {
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            const instructorID = data[0].id;
            const query = `
            SELECT courses.*, (SELECT COUNT(*) FROM courses WHERE user_courseID = ?) AS totalRecords FROM courses WHERE user_courseID = ?`;

            connection.query(query, [instructorID, instructorID], (err, results) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return res.status(500).json({ error: "Failed to fetch courses" });
                }
                if (results.length === 0) {
                    console.log("No courses found for instructor with ID:", instructorID);
                    return res.json("No courses available for this instructor for now!");
                } else {
                    return res.json(results);
                }
            });
          
        } else {
            return res.json({ error: "User not found" });
        }
    });
    
});

app.get('/api/deleteCourse', (req, res) => {
    const email = req.query.email;
    const courseID = req.query.courseID;
    console.log('Querying for courses: ' + email + ' for course ' + courseID)

    const deleteQuery = `DELETE FROM courses WHERE ID_course_specifier = ?`;
    connection.query(deleteQuery, [courseID], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Failed to delete course" });
        } else {
            console.log('Deleted course with ID:', courseID);
            return res.json("Course deleted successfully!");
        }
    });
});

app.post('/api/createQuiz', (req, res) => {
    const { quizTitle, description, timeLimit, questions, courseId } = req.body;

    console.log('Created quiz with:', req.body);
    const quizQuery = `
        INSERT INTO quizzes (quiz_title, quiz_description, time_limit, ID_course_specifier) 
        VALUES (?, ?, ?, ?)
    `;

    connection.query(quizQuery, [quizTitle, description, timeLimit, courseId], (err, result) => {
        if (err) {
            console.error('Error creating quiz:', err);
            return res.status(500).send('Error creating quiz');
        }
        const quizId = result.insertId;
        questions.forEach((question) => {
            const questionQuery = `
                INSERT INTO questions (quiz_id, question_text, question_type, points) 
                VALUES (?, ?, ?, ?)
            `;
            connection.query(questionQuery, [quizId, question.question, question.type, question.points], (err, questionResult) => {
                if (err) {
                    console.error('Error adding question:', err);
                    return;
                }
                const questionId = questionResult.insertId;
                if (question.type === 'multiple_choice') {
                    question.options.forEach((option, index) => {
                        const optionQuery = `
                            INSERT INTO multiple_choice_options (question_id, option_text, is_correct) 
                            VALUES (?, ?, ?)
                        `;
                        connection.query(optionQuery, [questionId, option, question.correctAnswer === index]);
                    });
                }
                if (question.type === 'true_false') {
                    const trueFalseQuery = `
                        INSERT INTO true_false_answers (question_id, correct_answer) 
                        VALUES (?, ?)
                    `;
                    connection.query(trueFalseQuery, [questionId, question.correctAnswer]);
                }
                if (question.type === 'short_answer') {
                    const shortAnswerQuery = `
                        INSERT INTO short_answer_answers (question_id, correct_answer) 
                        VALUES (?, ?)
                    `;
                    connection.query(shortAnswerQuery, [questionId, question.correctAnswer]);
                }
            });
        });
        res.send('Quiz created successfully!');
    });
});

app.get('/api/getQuiz/inCouses', (req, res) => {
    const  courseId  = req.query.idc;
    const query = `SELECT * FROM quizzes WHERE ID_course_specifier=?`;

    connection.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching quizzes:', err);
            return res.json('Error fetching quizzes');
        }
        else if (results.length > 0) {
            res.json(results);
        }
        else {
            return res.json('No quizzes found for this course');
        }
    });
});

app.post('/api/ADMINlogin', (req, res) => {
    const { username, password } = req.body;
    console.log('Admin login:', username, password);

    const checkAdminQuery = `SELECT * FROM projectadmin WHERE userName=? AND Password=?`;
    connection.query(checkAdminQuery, [username, password], (err, data) => {
        if (err) {
            return res.json({ error: `Error: ${err}` });
        } else if (data.length > 0) {
            return res.json({ success: "Admin login successful" });
        } else {
            return res.json({ error: "Invalid email or password" });
        }
    });
});

app.get('/api/data', (req, res) => {
    const userQuery = `
      SELECT 
        id AS user_id,
        CONCAT(FirstName, ' ', LastName) AS FullName,
        email AS user_email
      FROM registerd_user;
    `;
  
    const courseQuery = `
      SELECT 
        user_courseID AS course_id,
        course_title,
        course_description
      FROM courses;
    `;

    const commentsQuery = `
        SELECT 
        user_ID, comment
        FROM cources_comments`;
  
    connection.query(userQuery, (err, userResults) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }
  
      connection.query(courseQuery, (err, courseResults) => {
        if (err) {
          console.error('Error fetching course data:', err);
          return res.status(500).json({ error: 'Failed to fetch course data' });
        }

        connection.query(commentsQuery, (err, commentsResults) => {
            if (err) {
              console.error('Error fetching comments data:', err);
              return res.status(500).json({ error: 'Failed to fetch comments data' });
            }
            const combinedResults = {
                users: userResults,
                courses: courseResults,
                comments: commentsResults
              };
              res.json(combinedResults);
        });
      });
    });
  });


  app.delete('/apiAdmin/Dusers', (req, res) => {
    const userId = req.query.idu;
    const query = 'DELETE FROM registerd_user WHERE id = ?';
  
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ error: 'Failed to delete user' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  });
  

  app.delete('/api/courses', (req, res) => {
    const courseId = req.query.idc;
    const query = 'DELETE FROM courses WHERE user_courseID = ?';
  
    connection.query(query, [courseId], (err, result) => {
      if (err) {
        console.error('Error deleting course:', err);
        return res.status(500).json({ error: 'Failed to delete course' });
      }
      res.json({ message: 'Course deleted successfully' });
    });
  });

  app.delete('/apiAdmin/Dcomm' ,(req, res) => {
    const commentId = req.query.idcom;
    const commentT = req.query.comm;
    const query = 'DELETE FROM cources_comments WHERE user_ID = ? AND comment=?';
    connection.query(query, [commentId, commentT], (err, result) => {
        if (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({ error: 'Failed to delete comment' });
        }
        res.json({ message: 'Comment deleted successfully' });
    });
  });

  app.post('/apiAdmin/addUser', (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const verification_status = 'Verifyed User';

    const query = 'INSERT INTO registerd_user (email, password, FirstName, LastName, verification_state) VALUES (?, ?, ?, ?, ?)';
    bcrypt.hash(password.toString(), salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json('Failed to hash password');
        }
        connection.query(query, [email, hash, firstName, lastName, verification_status], (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).json('Failed to add user');
            }
            res.json('User added successfully');
        });
    });
 });

  app.post('/api/SubscribersUser/News', (req, res) =>{
    const { email } = req.body;
    const checkEmail_if_exist = `SELECT * FROM subscribers_users WHERE emails=?`;
    connection.query(checkEmail_if_exist, [email], (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json('Failed to check email');
        } else if (results.length > 0) {
            return res.json('Email already exists in our system');
        } else {
            const query = 'INSERT INTO subscribers_users (emails) VALUES (?)';
            connection.query(query, [email], (err, result) => {
                if (err) {
                    console.error('Error adding subscriber:', err);
                    return res.json('Failed to add subscriber');
                }
                res.json('Subscriber added successfully');
            });
        }
    });
  });


const htmlTemplate_news = fs.readFileSync('news-mail-template.HTML', 'utf8');
const template2 = handlebars.compile(htmlTemplate_news);

app.post('/api/news', (req, res) => {
    const { newsMessage } = req.query; 
  
    const query = 'SELECT emails FROM subscribers_users';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching emails:', err);
        return res.status(500).json({ error: 'Failed to fetch emails' });
      }
      const emailData = {
        news: newsMessage,
      };
  
      const htmlToSend = template2(emailData);
  
      results.forEach((subscriber) => {
        const mailOptions = {
          from: 'csminds0101@gmail.com', 
          to: subscriber.emails, 
          subject: 'CS Minds Group News', 
          text: newsMessage, 
          html: htmlToSend, 
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending email to ${subscriber.email}:`, error);
          } else {
            console.log(`Email sent to ${subscriber.emails}:`);
          }
        });
      });
  
      res.status(200).json({ message: 'Newsletter sent to all subscribers' });
    });
  });

  app.get('/post/quizPage', (req, res) => {
    const quizId = req.query.QIDp;
  
    if (!quizId) {
      return res.status(400).send('Quiz ID is required');
    }
  
    const quizQuery = `
      SELECT * FROM quizzes WHERE quiz_id = ?;
    `;
  
    const questionsQuery = `
      SELECT * FROM questions WHERE quiz_id = ?;
    `;
  
    const multipleChoiceQuery = `
      SELECT * FROM multiple_choice_options WHERE question_id IN 
      (SELECT question_id FROM questions WHERE quiz_id = ?);
    `;
  
    const true_or_falseQuery = `
      SELECT * FROM true_false_answers WHERE question_id IN 
      (SELECT question_id FROM questions WHERE quiz_id = ?);
    `;
  
    const short_answer_answers = `
      SELECT * FROM short_answer_answers WHERE question_id IN 
      (SELECT question_id FROM questions WHERE quiz_id = ?);
    `;
  
    const matchingPairsQuery = `
      SELECT * FROM matching_pairs WHERE question_id IN 
      (SELECT question_id FROM questions WHERE quiz_id = ?);
    `;
  
    connection.query(quizQuery, [quizId], (err, quizResults) => {
      if (err) return res.status(500).send(err);
  
      connection.query(questionsQuery, [quizId], (err, questionsResults) => {
        if (err) return res.status(500).send(err);
  
        connection.query(multipleChoiceQuery, [quizId], (err, mcOptions) => {
          if (err) return res.status(500).send(err);
  
          connection.query(matchingPairsQuery, [quizId], (err, matchPairs) => {
            if (err) return res.status(500).send(err);
  
            connection.query(true_or_falseQuery, [quizId], (err, true_or_false) => {
              if (err) return res.status(500).send(err);
  
              connection.query(short_answer_answers, [quizId], (err, short_answer) => {
                if (err) return res.status(500).send(err);
  
                // Process the full quiz data
                const fullQuiz = {
                  quizInfo: quizResults[0],
                  questions: questionsResults.map((q) => ({
                    ...q,
                    options: mcOptions.filter(o => o.question_id === q.question_id),
                    pairs: matchPairs.filter(p => p.question_id === q.question_id),
                    true_false: true_or_false.filter(t => t.question_id === q.question_id),
                    short_answer: short_answer.filter(s => s.question_id === q.question_id)
                  }))
                };
  
                res.json(fullQuiz);
              });
            });
          });
        });
      });
    });
  });


app.get('/api/quizzes/attemp', (req, res) => {
    const quizID = req.query.QIDp;
    const user_EMAIL = req.query.userEmail;
    const getScore = req.query.score;
    const static_state = 'done';

    const getIDQuery = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(getIDQuery, [user_EMAIL], (err, result) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ error: 'Failed to fetch user ID' });
        }
        const userID = result[0].id;
        const getAttemptsQuery = `
        INSERT INTO users_attempt_quizzes (user_ID, quiz_ID, state_quizTO_user, Mark) VALUES(?, ?, ?, ?)`;
        connection.query(getAttemptsQuery, [userID, quizID, static_state, getScore], (err, attempts) => {
            if (err) {
                console.error('Error fetching attempts:', err);
                return res.status(500).json({ error: 'Failed to fetch attempts' });
            }
            res.json(attempts);
        });
    });
});  

app.get('/api/fetch/attempt', (req, res) => {
    const email = req.query.email;
    const check = `SELECT id FROM registerd_user WHERE email=?`;
    
    connection.query(check, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ error: 'Failed to fetch user ID' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userID = result[0].id;  
        const fetchAttemptsQuery = `SELECT * FROM users_attempt_quizzes WHERE user_ID=?`;
        
        connection.query(fetchAttemptsQuery, [userID], (err, attempts) => {
            if (err) {
                console.error('Error fetching attempts:', err);
                return res.status(500).json({ error: 'Failed to fetch attempts' });
            }

            return res.json(attempts);
        });
    });
});


app.post('/account-reset-password', (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    const checkUser = `SELECT * FROM registerd_user WHERE email = ?`;

    connection.query(checkUser, [email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Database error: " + err });
        }
        if (data.length > 0) {
            if (data[0].verification_state === 'Verifyed User') {
                bcrypt.compare(currentPassword, data[0].password, (err, response) => {
                    if (err) return res.status(500).json({ error: "Error: " + err });
                    
                    if (response) {
                        const saltRounds = 10;
                        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                            if (err) return res.status(500).json({ error: "Error: " + err });

                            const updatePassword = `UPDATE registerd_user SET password = ? WHERE email = ?`;
                            connection.query(updatePassword, [hash, email], (err, result) => {
                                if (err) return res.status(500).json({ error: "Error: " + err });
                                
                                console.log("Password updated for: " + email);
                                return res.json({ message: "Password updated successfully" });
                            });
                        });
                    } else {
                        return res.status(400).json({ error: "Invalid current password" });
                    }
                });
            } else {
                return res.status(400).json({ error: "User not verified" });
            }
        } else {
            return res.status(400).json({ error: "Invalid email or user not found" });
        }
    });
});

app.get('/api/DELETE/user', (req, res) => {
    const email = req.query.e1;
    const deleteUser = `DELETE FROM registerd_user WHERE email =?`;
    connection.query(deleteUser, [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Bad Error: " + err });
        if (result.affectedRows > 0) {
            console.log("User deleted: " + email);
            return res.json({ message: "User deleted successfully" });
        } else {
            return res.status(400).json({ error: "Invalid email or user not found" });
        }
    });
})


app.post('/api/create/assignments', (req, res) => {
    const { title, description, question, deadline, courseId } = req.body;
    const createAssignment = `INSERT INTO assignment (title, description, question, submission_time, ID_course_specifier) VALUES (?,?,?,?,?)`;
    connection.query(createAssignment, [title, description, question, deadline, courseId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error: " + err });
        else {console.log("Assignment created successfully: ");
            return res.json({ message: "Assignment created successfully"});}
    });
});

app.get('/api/getAssignments/inCourses', (req, res) => {
    const courseId = req.query.idc;
    const getAssignments = `SELECT * FROM assignment WHERE ID_course_specifier =?`;
    connection.query(getAssignments, [courseId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch assignments' });
        }
        else if(result.length > 0){
            return res.json(result);
        }
        else{
            return res.json({ state: 'No assignments found for this course' });
        }
    });
});

app.get('/post/assignmentPage', (req, res) => {
    const assignmentId = req.query.AIDp;
    const getAssignment = `SELECT * FROM assignment WHERE assignment_id=?`;
    connection.query(getAssignment, [assignmentId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch assignment' });
        }
        else if(result.length > 0){
            return res.json(result);
        }
        else{
            return res.json({ state: 'No assignment found with this ID' });
        }
    });
});

app.post('/api/assignmentsSubmit',(req, res) => {
    const { email, assignment_id} = req.body;
    const state_assignment = 'done';

    const checkUser = `SELECT * FROM registerd_user WHERE email = ?`;
    connection.query(checkUser, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ error: 'Failed to fetch user ID' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userID = result[0].id;  
        const InsertAttemptQuery = `INSERT INTO  users_attempt_assignment (user_ID, assignment_id, state_assignment) VALUES (?,?,?)`;
        
        connection.query(InsertAttemptQuery, [userID, assignment_id, state_assignment], (err, attempts) => {
            if (err) {
                console.error('Error InsertAttemptQuery attempts:', err);
                return res.json({ error: 'Failed to InsertAttemptQuery attempts' });
            }
            return res.json(attempts);
        });
    });
});

app.get('/api/fetch/attempt/assignment', (req, res) => {
    const email = req.query.email;
    const check = `SELECT id FROM registerd_user WHERE email=?`;
    
    connection.query(check, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ error: 'Failed to fetch user ID' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userID = result[0].id;  
        const fetchAttemptsQuery = `SELECT * FROM  users_attempt_assignment WHERE user_ID=?`;
        
        connection.query(fetchAttemptsQuery, [userID], (err, attempts) => {
            if (err) {
                console.error('Error fetching attempts:', err);
                return res.status(500).json({ error: 'Failed to fetch attempts' });
            }

            return res.json(attempts);
        });
    });
});


app.listen(port, () => {
    console.log('Server is running at port', port);
});



