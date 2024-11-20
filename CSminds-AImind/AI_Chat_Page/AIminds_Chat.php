<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="AIminds_Chat.CSS">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
    <title>AI mind</title>
</head>

<body>

<button class="AI-mind" id="AI-mind">AI mind</button>
<!----<button id="copy-button">copy-button</button>----->
<div class="sidebar" id="sidebar">   

    <button onclick="myFunction()" title="Scale or minimize menu" class="menu_btn" id="menu_btn"><img src="icon/menu (1).png" alt="menu" class="menu" id="menu"></button>
    <span class="title_menu" id="title_menu"></span>

    <i class="fas fa-plus " id="New-Chat">&nbsp;&nbsp;New Chat</i>

    <img src="icon/recent.png" alt="recent" class="recent-img" id="recent-img">
   <span class="recent" id="recent">Recent chat</span>

   <div class="recent_chat" id="recent_chat"></div>
   
    <button class="idea_btn" title="Explore AI mind"><img src="icon/direction.png" class="idea" id="idea" alt="direction"><h3 class="Our_direction" id="Our_direction">Explore</h3></button>
    <span class="direction_menu" id="direction_menu"></span>

    <button class="question_btn" title="Help"><img src="icon/question.png" class="question" id="question" alt="question"><h3 class="Help" id="Help">Help</h3></button>
    <span class="question_menu" id="question_menu"></span>

    <button  class="setting_btn" id="setting_btn" title="setting"><img src="icon/setting.png" class="setting" id="setting" alt="settings"><h3 class="Settings" id="Settings">Settings</h3></button> 
    <span class="setting_menu" id="setting_menu"></span>   

    
</div>

<div class="setting_toggle" id="setting_toggle">

<div class="toggle-container-2">
    <img src="icon/bookmark.png" alt="save" class="save-img" id="save-img">
    <label for="save-mode-toggle" class="save_Dark_mode_text">Save chat</label>
    <input type="checkbox" id="save-mode-toggle" class="save-toggle-switch">
    <label for="save-mode-toggle" class="save-toggle-label"></label>
</div>

<div class="toggle-container">
    <img src="icon/sleep-mode.png" alt="dark" class="dark-img" id="dark-img">
    <label for="dark-mode-toggle" class="Dark_mode_text">Dark mode</label>
    <input type="checkbox" id="dark-mode-toggle" class="toggle-switch">
    <label for="dark-mode-toggle" class="toggle-label"></label>
</div>

</div> 

<main>
<div class="container" id="container">

<div class="hidden_header">
    <img src="image/33.jpg" alt="profile" id="profile_img" class="profile_img">
    <span class="tooltip" id="tooltip" >Retrieve User name and Email</span>
    <button class="download_button" id="download_button">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Download your conversation<img id="power_img" class="power_img" src="icon/download.png" alt="power"></button>
</div>

<div class="chat_tools">
    <textarea  type="text" id="Response" class="chat_input" rows="1" placeholder="Ask AIminds..."></textarea>
    <button onclick="getTextareaValue()" type="submit" name="send_prompt" class="send_prompt" id="send_prompt" >
        <span class="info_tooltip" id="info_tooltip">send</span>
        <img src="icon/B_next.png" alt="go" class="next_img" id="next">
    </button>
</div> 

</div>
</main>

<div class="profile-view" id="profile-view">

     <button class="profile-show-btn" id="profile-close-btn"><img src="icon/close.png" alt="close" class="close-profile" id="close-profile"></button>
     <h3 class="email-here">retrieve Email here</h3>

     <img src="image/33.jpg" alt="profile" id="profile_img_user" class="profile_img_user">

     <h3 class="Name-here">Hello "Name"</h3>
     <button class="logout-btn" id="logout-btn"><h3 class="logout-btn-text">Logout</h3>&nbsp;&nbsp;&nbsp;
     <img src="icon/logout.png" class="logout-img" id="logout-img" alt="logout"></button>

     <button class="cs-mind-btn" id="cs-mind-btn"><h3 class="cs-mind-btn-text">CSmind</h3>&nbsp;&nbsp;&nbsp;
     <img src="icon/brainnew.png" class="brain-img" id="brain-img" alt="brain"></button>

     <h5 class="privacy-note">Privacy settings is saved</h5>
</div>

<div class="chat-container">
            <div class="text-animation" id="text-animation">
                <p class="welcome-aimind" id="textSpan">Welcome to AI mind chat</p>
            </div>
           <center>
           
           <div class="chat-area" id="chat_area">
                <div class="message user-message">
                    
                </div>
                <div class="message ai-message">
                    
                </div>
                
            </div> 

            <div class="like-div" id="like-div">

                    <div class="header-box">
                    <button class="profile-show-btn2" id="profile-close-btn2"><i class="fas fa-times fa-2x" id="close-profile1"></i></button>
                    <h4 class="like-evaluation"> Why did you pick up this evaluation? (Optional)</h4>
                    </div>

                    <div class="check-boxes-3">
                        <label for="check1" class="custom-checkbox">
                            correct
                            <input type="checkbox" id="check1" class="checkbox">
                            <span class="checkmark"></span>
                        </label>
                        <label for="check2" class="custom-checkbox">
                            easy to understand
                            <input type="checkbox" id="check2" class="checkbox">
                            <span class="checkmark"></span>
                        </label>

                        <label for="check3" class="custom-checkbox">
                            Completed
                            <input type="checkbox" id="check3" class="checkbox">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                    <div class="input_comment_and_submit">
                        <textarea rows="1" type="text" class="why-in-comment" id="Response" placeholder="provide feedback"></textarea>
                        <button type="submit" class="submit-why-like">submit</button>
                    </div>
                </div>
                
                <div class="dislike-div" id="dislike-div">
                <div class="header-box-2">
                    <button class="profile-show-btn3" id="profile-close-btn3"><i class="fas fa-times fa-2x" id="close-profile"></i></button>
                    <h4 class="dislike-evaluation"> Why did you pick up this evaluation? (Optional)</h4>
                    </div>

                    <div class="check-boxes-6">
                        <label for="check5" class="custom-checkbox-2">
                            incorrect
                            <input type="checkbox" id="check5" class="checkbox1">
                            <span class="checkmark-2"></span>
                        </label>
                        <label for="check6" class="custom-checkbox-2">
                            incomprehensible words
                            <input type="checkbox" id="check6" class="checkbox1">
                            <span class="checkmark-2"></span>
                        </label>

                        <label for="check7" class="custom-checkbox-2">
                            Missing information
                            <input type="checkbox" id="check7" class="checkbox1">
                            <span class="checkmark-2"></span>
                        </label>
                    </div>
                    <div class="input_comment_and_submit-2">
                        <textarea rows="1" type="text" class="why-in-comment-2" id="Response" placeholder="provide feedback"></textarea>
                        <button type="submit" class="submit-why-like-2">submit</button>
                    </div>
                </div>
           </center>
</div>

<script src="AIminds.JS"></script>
</body>

</html>