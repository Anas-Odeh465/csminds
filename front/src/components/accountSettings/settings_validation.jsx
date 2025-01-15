export default function Settings_Validation(values){
    let error = {};
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if(values.password === ""){
        error.password = "Fill your password please";
    }
    else if(!password_pattern.test(values.password)){
        error.password = "password must be 8 characters capital letter with lowercase  letters and numbers"; 
    }
    else{
        error.password = "";
    }
    return error;
}