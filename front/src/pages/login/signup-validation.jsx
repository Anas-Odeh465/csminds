export default function validation_signup(values){
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    {/* last name validation */}
    if(values.firstname === ""){
        error.firstname = "Fill your first name please";
    }
    else{
        error.firstname = "";
    }

    {/* last name validation */}
    if(values.lastname === ""){
        error.lastname = "Fill your last name please";
    }
    else{
        error.lastname = "";
    }

    {/* email validation */}
    if(values.email === ""){
        error.email = "Fill your email please";
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Invalid email format";
    }
    else{
        error.email = "";
    }

    {/* password validation */}
    if(values.password === ""){
        error.password = "Fill your password please";
    }
    else if(!password_pattern.test(values.password)){
        error.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
    }
    else{
        error.password = "";
    }

    return error;
}