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
        methods: ['GET', 'POST'],
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
    const query = ` SELECT i.* FROM registerd_user u
        LEFT JOIN instructors i ON u.id = i.user_ID
        WHERE u.email = ?`;
    connection.query(query, [email], (err, result) => {
        if (err) {
            return res.json("Error: " + err);
        }
        if (result.length > 0 && result[0].user_ID) {
            return res.json({
                Status: "found instructor",
                instructors: 'true'
            });
        } else if (result.length > 0) {
            return res.json("Not instructor");
        } else {
            return res.json("User not found");
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
            if(data[0].verification_state === 'Verifyed User'){
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

app.post('/update/profile', (req, res) =>{
    let {firstName, lastName, email, headline, biography,
      X, youtube, linkedin, facebook } = req.body;

    firstName = req.body[0];
    lastName = req.body[1];
    email = req.body[2];
    headline = req.body[3];
    biography = req.body[4];
    X = req.body[5];
    youtube = req.body[6];
    linkedin = req.body[7];
    facebook = req.body[8];

    console.log(`Server got information to update profile from ${email}: `, {
        firstName : firstName, 
        lastName : lastName, 
        headline : headline,
        biography: biography,
        X: X,
        youtube: youtube,
        linkedin: linkedin,
        facebook: facebook
    });

    const checkProfile = `SELECT * FROM registerd_user WHERE email=?`;
    connection.query(checkProfile, [email], (err, data) => {
        if (err){
            return res.json("Error: " + err);
        }
        else if (data.length > 0){
            const updateProfile = `UPDATE registerd_user SET FirstName=?, LastName=?, headline=?, biography=?,  X=?, youtube=?, linkedin=?, facebook=? WHERE email=?`;
            connection.query(updateProfile, [firstName, lastName, headline, biography, X, youtube, linkedin, facebook, email], (err, data) =>{
                if (err){
                    return res.json("Error: " + err);
                }
                else{
                    return res.json("Profile updated successfully");
                }
            });
        }
        else{
            return res.json("User not found");
        }
    });
});

app.post('/Instuctor/info', (req, res) => {
    const Name = req.body[0];
    const WorkEmail = req.body[1];
    const CS_Minds_Orginal_email = req.body[2];
    const Role = req.body[3];
    const Number = req.body[4];

    console.log(`Server got information to set instructor info from ${CS_Minds_Orginal_email}: `, {
        Name : Name,
        WorkEmail : WorkEmail,
        CS_Minds_Orginal_email : CS_Minds_Orginal_email,
        Role : Role,
        Number : Number
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
                        (user_ID, instructor_name, work_Email, role, number_Learners) VALUES(?,?,?,?,?)`;
                        connection.query(Insert_Instructor, [userID, Name, WorkEmail, Role, Number], (err, data) =>{
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
                        (user_ID, instructor_name, work_Email, role, number_Learners) VALUES(?,?,?,?,?)`;
                        connection.query(Insert_Instructor, [userID, Name, CS_Minds_Orginal_email, Role, Number], (err, data) =>{
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
    const category = req.body.category;
    const level = req.body.level;
    const requirements = req.body.prerequisites;
    const outcomes = req.body.outcomes;
    const price = req.body.price;

    console.log('\n================================\n');
    console.log('Request Data:', { email, title, category, level, requirements, outcomes, price });
    console.log("Uploaded Files:", req.files);

    if (!req.files) {
        return res.status(400).json({ error: "Video file is required" });
    }

    const videoPath = req.files.video ? `/uploads/Videos/${req.files.video[0].filename}` : null;
    const imagePath = req.files.coursePic ? `/uploads/Images/${req.files.coursePic[0].filename}`: null;

        console.log("Saved video path:", videoPath);
        console.log("Saved image path:", imagePath);

    const outcomeArray = Array.isArray(outcomes) ? outcomes : (typeof outcomes === 'string' ? outcomes.split(',') : []);
    if (outcomeArray.length > 4) {
        return res.status(400).json({ error: "A maximum of 4 outcomes is allowed" });
    }
    const [outcome_1 = null, outcome_2 = null, outcome_3 = null, outcome_4 = null] = outcomeArray;

    const requirementArray = Array.isArray(requirements) ? requirements : (typeof requirements === 'string' ? requirements.split(',') : []);
    if (requirementArray.length > 4) {
        return res.status(400).json({ error: "A maximum of 4 requirements is allowed" });
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
            (user_courseID, course_level, course_title, course_category, video_course, course_picture, course_pricing)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(insertQuery, [instructorID, level, title, category, videoPath, imagePath, price], (err, data) => {
            if (err) {
                return res.json("Error: " + err);
            }else{
                const query_2 = `SELECT ID_course_specifier FROM courses WHERE user_courseID=?`;
                connection.query(query_2, [instructorID], (err, data) => {
                    if(err){
                        return res.json("Error: " + err);
                    }
                    else{
                        const courseID = data[0].ID_course_specifier;
                        const insertOutcomesQuery  = `INSERT INTO courses_outcomes 
                        (user_courseID, outcome_1, outcome_2, outcome_3, outcome_4, ID_course_specifier)
                            VALUES(?, ?, ?, ?, ?, ?)`;
                        connection.query(insertOutcomesQuery, [instructorID, outcome_1, outcome_2, outcome_3, outcome_4, courseID], (err, data) => {
                            if(err){
                                return res.json("Error: " + err);
                            }
                            const insertRequirementsQuery = `
                            INSERT INTO courses_requirements (user_courseID, requirement_1, requirement_2, requirement_3, requirement_4, ID_course_specifier)
                            VALUES (?, ?, ?, ?, ?, ?)
                            `;
                            connection.query(insertRequirementsQuery, [instructorID, requirement_1, requirement_2, requirement_3, requirement_4, courseID], (err, requirementsResult) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: "Failed to insert requirements" });
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
    const query = `
        SELECT courses.*, CONCAT(registerd_user.FirstName, ' ', registerd_user.LastName) AS FullName
        FROM courses 
        INNER JOIN registerd_user 
        ON courses.user_courseID = registerd_user.id
    `;
     
    connection.query(query, (err, results) => {
        if (err) {
            return res.json("Failed to fetch courses");
        }
        if (results.length === 0) {
            return res.json([]);
        }
        else{
            return res.json(results);   
        }
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
                    console.log('Messages from DB:', messages); 
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





app.listen(port, () => {
    console.log('Server is running at port', port);
});



