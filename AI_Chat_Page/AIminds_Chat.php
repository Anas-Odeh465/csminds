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

<button class="AI-mind" id="AI-mind">AI Mind</button>

<!----<button id="copy-button">copy-button</button>----->
<div class="sidebar" id="sidebar">   

    <button onclick="myFunction()" title="Scale or minimize menu" class="menu_btn" id="menu_btn"><img src="icon/menu (1).png" alt="menu" class="menu" id="menu"></button>
    <span class="title_menu" id="title_menu"></span>

    <i class="fas fa-plus " id="New-Chat">&nbsp;&nbsp;New Chat</i>

    <img src="icon/recent.png" alt="recent" class="recent-img" id="recent-img">
   <span class="recent" id="recent">Recent chat</span>

   <div class="recent_chat" id="recent_chat"></div>
   
   <button class="idea_btn" title="Explore AI mind" onclick="feature()"><img src="icon/direction.png" class="idea" id="idea" alt="direction"><h3 class="Our_direction" id="Our_direction">Explore</h3></button>
        <span class="direction_menu" id="direction_menu"></span>
    

    <button class="question_btn" title="Help" onclick="help()"><img src="icon/question.png" class="question" id="question" alt="question"><h3 class="Help" id="Help">Help</h3></button>
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
    <div id="avatar-2" class="avatar-2">
        <span id="avatar-text-2" class="avatar-text-2"></span>
    </div>
    <img src="image/Guest user.png" alt="profile" id="profile_img" class="profile_img">
    <span class="tooltip" id="tooltip" >Guest</span>
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
     <h3 class="email-here" id="email-here"></h3>

     <div id="avatar" class="avatar">
        <span id="avatar-text" class="avatar-text"></span>
    </div>

     <img src="image/Guest user.png" id="profile_img_user" class="profile_img_user">

     <h3 class="Name-here" id="Name-here"></h3>

    <a >
        <button class="logout-btn" id="logout-btn" onclick="Classifier()">
            <h3 class="logout-btn-text" id="logout-btn-text">Login</h3>&nbsp;&nbsp;&nbsp;
            <img src="icon/logout.png" class="logout-img" id="logout-img" alt="logout">
        </button>
    </a>

     <a href="http://localhost:5173/"><button class="cs-mind-btn" id="cs-mind-btn"><h3 class="cs-mind-btn-text">CSmind</h3>&nbsp;&nbsp;&nbsp;
     <img src="icon/brainnew.png" class="brain-img" id="brain-img" alt="brain"></button></a>

     <h5 class="privacy-note">Privacy settings is saved</h5>
</div>

<div class="chat-container">
            <div class="text-animation" id="text-animation">
                <p class="welcome-aimind" id="textSpan">Welcome to AI mind chat</p>
            </div>
           <center>
           
           <div class="chat-area" id="chat_area">
                
                
            </div> 

           </center>
</div>

<script src="AIminds.JS"></script>

<script>
        async function getinfo() {
            console.log('Fetching data...');
            try {
                const response = await fetch('http://localhost:3307/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                console.log('Response received:', response);

                if (!response.ok) {
                    document.getElementById('Name-here').innerText = 'Login to save chat';
                    document.getElementById('Name-here').style.marginLeft = '-15px';
                    document.getElementById('textSpan').style.marginLeft = '-100px';
                    document.getElementById('tooltip').style.marginLeft = '20px';
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                else{
                    const data = await response.json();
                    console.log('AI mind got information:', data);
                    console.log(`First name: ${data.FirstName}, Last name: ${data.LastName}`);
                    if(data){
                        document.getElementById('logout-btn-text').innerText = 'Logout';
                        if(data.FirstName){
                        const text_1 = document.getElementById('textSpan');
                        text_1.innerText = `Hello ${data.FirstName} `;
                        }
                        if(data.LastName){
                            const text_2 = document.getElementById('Name-here');
                            text_2.innerText = `${data.FirstName} ${data.LastName}`;
                        }
                        if(data.Email){
                            const text_3 = document.getElementById('email-here');
                            text_3.innerText = `${data.Email}`;
                        }
                        console.log(`http://localhost:3307${data.photo}`);
                        if(data.photo !== 'No photo available'){
                            const photo_1 = document.getElementById('profile_img_user');
                            photo_1.src = `http://localhost:3307${data.photo}`;
                            
                            const photo_2 = document.getElementById('profile_img');
                            photo_2.src = `http://localhost:3307${data.photo}`;

                            const avatarText = document.getElementById('avatar-text');
                            const avatar = document.getElementById('avatar');

                            const avatarText_2 = document.getElementById('avatar-text-2');
                            const avatar_2 = document.getElementById('avatar-2');

                            avatarText.style.display = 'none';
                            avatar.style.display = 'none';
                            
                            avatarText_2.style.display = 'none';
                            avatar_2.style.display = 'none';
                        }
                        else if(data){
                            const photo_1 = document.getElementById('profile_img_user');
                            const photo_2 = document.getElementById('profile_img');

                            photo_1.style.display = 'none';
                            photo_2.style.display = 'none';

                            const avatarText = document.getElementById('avatar-text');
                            const avatar = document.getElementById('avatar');

                            avatarText.innerText = data.FirstName.charAt(0); 
                            avatarText.style.display = 'block';

                            const avatarText_2 = document.getElementById('avatar-text-2');
                            const avatar_2 = document.getElementById('avatar-2');

                            avatarText_2.innerText = data.FirstName.charAt(0); 
                            avatarText_2.style.display = 'block';
                        }
                        if(data.FirstName || data.LastName && data.Email) {
                            const tooltip = document.getElementById('tooltip');
                            tooltip.innerText = `${data.FirstName} ${data.LastName} \n ${data.Email}`;
                        }
                        else{
                            const photo_inner = document.getElementById('profile_img_user');
                            const photo_outier = document.getElementById('profile_img');

                            photo_inner.src = 'image/Guest user.png';
                            photo_outier.src = 'image/Guest user.png';
                        }
                    }
                }
            } catch (error) {
                console.error('AI mind got error:', error);
            }
        }
        window.onload = async () => {
            console.log('Page loaded. Calling getinfo...');
            await getinfo();
        };
    </script>
</body>

</html>