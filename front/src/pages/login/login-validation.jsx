export function validation_login(values){
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if(values.email === ""){
        error.email = "Fill your email please";
    }
    else if(!email_pattern.test(values.email)){
        error.email = "Invalid email format";
    }
    else{
        error.email = "";
    }

    if(values.password === ""){
        error.password = "Fill your password please";
    }
    else if(!password_pattern.test(values.password)){
        error.password = "password not match";
    }
    else{
        error.password = "";
    }
    return error;
}

export function validate_only_email(email){
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(email === ""){
        error.email = "Fill your email please";
    }
    else if(!email_pattern.test(email)){
        email = "Invalid email format";
    }
    else{
        email = "";
    }

    return error;
}