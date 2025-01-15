//--------to-make-span-title-info-about-user---------
const image = document.getElementById('profile_img');
const span1 = document.getElementById('tooltip');

image.addEventListener('mouseover', function() {
    if (image.style.transform !== 'scale(1.25)') {
        span1.style.display = 'block'; 
    }
});
image.addEventListener('mouseout', function() {
    span1.style.display = 'none'; 
});

//--------to-make-input-flow-in-the-textarea---------
const textarea = document.getElementById('Response');
const area_chat = document.getElementById('chat_area');
const maxHeight = 250; 
const minHeight = 61;
function autoResize() {
    this.style.height = '60px'; 
    this.style.height = (this.scrollHeight) + 'px'; 
    
    if (this.scrollHeight >= maxHeight) {
        this.style.height = maxHeight + 'px'; 
        this.style.overflowY = 'auto'; 
        this.style.borderRadius = '20px';
        area_chat.style.zIndex = '-1';
    }if (this.scrollHeight >= minHeight) {
        this.style.borderRadius = '20px';
        area_chat.style.zIndex = '-1';
    } else {
        this.style.overflowY = 'hidden'; 
        this.style.borderRadius = '100px';
        area_chat.style.zIndex = '0';
    }
}
textarea.addEventListener('input', autoResize);
autoResize.call(textarea);

//--------to-make-input-show--button-----------
const input_value = textarea.value
const button_send_chat = document.getElementById('send_prompt')
textarea.addEventListener('input', function() {
    if (textarea.value.trim() !== "") {
        button_send_chat.style.display = 'block';
    } else {
        button_send_chat.style.display = 'none';
    }     
})

//--------to-make-input-show--button-tooltip----------
const button = document.getElementById('send_prompt');
const span2 = document.getElementById('info_tooltip');
button.addEventListener('input', function(){
    if(input_value.value.trim() !== ""){
        button.disabled = false;
        if(button.disabled == false){
            button.style.cursor = 'pointer';
            span2.style.visibility = 'hidden'; 
        }
       
    }
    else{
        button.disabled = true;
        if(button.disabled == true){
            button.style.cursor = 'auto';
            span2.style.visibility = 'visible';   
        }  
    }
})

//--------to-make-menu-shift-element-and--menu-shown-------------
function myFunction() {
    var div = document.getElementById('sidebar');
    const content = document.getElementById('Response');
    const send = document.getElementById('send_prompt');
    const Explore = document.getElementById('Our_direction');
    const Help = document.getElementById('Help');
    const Settings =document.getElementById('Settings');
    const recent = document.getElementById('recent');
    const chat_area = document.getElementById('chat_area');
    const settings_box = document.getElementById('setting_toggle');
    const AImind = document.getElementById('AI-mind');
    const text_animation = document.getElementById('text-animation')
    const recent_div = document.getElementById('recent_chat');
    const getNewChat = document.getElementById('New-Chat');

    if (div.style.width === '40%') {
        div.style.width = '6%'; 
        content.classList.remove('shifted');
        send.classList.remove('shifted');
        chat_area.classList.remove('shiftit');
        settings_box.classList.remove('shofti');
        AImind.classList.remove('shiftAImind');
        text_animation.classList.remove('shooft');
        Explore.style.visibility = 'hidden';
        Explore.style.transition = 'all 0.1s step-end';
        Help.style.visibility = 'hidden';
        Help.style.transition = 'all 0.1s step-end';
        Settings.style.visibility = 'hidden';
        Settings.style.transition = 'all 0.1s step-end';
        recent.style.visibility = 'hidden';
        recent.style.transition = 'all 0.1s step-end';
        recent_div.style.transition = 'all 0.3s step-end';
        recent_div.style.visibility = 'hidden';
        getNewChat.style.visibility = 'hidden';
    } else {
        div.style.width = '40%'; 
        content.classList.add('shifted');
        send.classList.add('shifted');
        chat_area.classList.add('shiftit');
        settings_box.classList.add('shofti');
        AImind.classList.add('shiftAImind');
        text_animation.classList.add('shooft');
        Explore.style.visibility = 'visible';
        Explore.style.transition = 'all 0.3s step-end';
        Help.style.visibility = 'visible';
        Help.style.transition = 'all 0.3s step-end';
        Settings.style.visibility = 'visible';
        Settings.style.transition = 'all 0.3s step-end';
        recent.style.visibility = 'visible';
        recent.style.transition = 'all 0.3s step-end';
        recent_div.style.visibility = 'visible';
        recent_div.style.transition = 'all 0.3s step-end';
        getNewChat.style.visibility = 'visible';
    }

}

// fetch user information

// chat messages system between user and ai respnse
let chatInput = document.getElementById('Response').value;
const sendButton = document.getElementById('send_prompt');

let message = chatInput.value;
let save_user_input_to_the_txt_file = " ";
function getTextareaValue() {
    const text_animation = document.getElementById('text-animation');
    const textareaElement = document.getElementById("Response"); 
    let value_of_input = textareaElement.value; 
    save_user_input_to_the_txt_file += 'You: '+value_of_input + '\n\n';

    textareaElement.addEventListener('input', function() {
        if (textarea.value.trim() !== "") {
            sendButton.style.display = 'block';
            recent_chat(value_of_input);
            
        } else {
            sendButton.style.display = 'none';
            textarea.value = "";
        }     
    });
    if (value_of_input !== "") { 
        appendMessage_user(value_of_input, 'user-message');
        textareaElement.value = ""; 
        autoResize.call(textareaElement); 
        text_animation.style.display = 'none'; 
        fetch_start(value_of_input);
    } 
    const dataToSend = { message: value_of_input };
    

    fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);

        const formattedResponse = data.response.replace(/\n/g, '<br>'); 

        appendMessage(formattedResponse, 'ai-message');
    })
    .catch(error => console.error('Error:', error));
}

function callback_for_recent_response(message1){
    const dataToSend = { message: message1 };
    
    fetch('http://127.0.0.1:5000/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);

        const formattedResponse = data.response.replace(/\n/g, '<br>'); 

        appendMessage(formattedResponse, 'ai-message');
    })
    .catch(error => console.error('Error:', error));
}



let messageCounter = 0;
let content_text = "";
function appendMessage(message, className) { 
    const chatArea = document.getElementById('chat_area');
    const messageDiv = document.createElement('div');
    const spanMessage = document.createElement('span');

    const spinner_load = document.createElement('div');

    spinner_load.className = 'spinner';
    spinner_load.style.display = 'block';
    


    messageCounter++;

    const formattedMessage = message.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');;
    messageDiv.className = `message ${className}`;
    spanMessage.style.writingMode = 'normal';
    spanMessage.innerHTML = formattedMessage;
    spanMessage.style.flexGrow = '1';
    spanMessage.style.alignSelf = 'flex-start';

    content_text += formattedMessage + "\n\n\n";

    spanMessage.id = `message-${messageCounter}`;

    
    messageDiv.appendChild(spinner_load);
    chatArea.appendChild(messageDiv);
    
    setTimeout(() => {
        setTimeout(() => {
            spinner_load.style.display = 'none';
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 0);
        messageDiv.appendChild(spanMessage);

        chatArea.appendChild(messageDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 1000);
   
    localStorage.setItem('AI-message',formattedMessage);
    
}



function appendMessage_user(message, className) {
    const chatArea = document.getElementById('chat_area');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<span>${message}</span>`;
    chatArea.appendChild(messageDiv);
    localStorage.setItem('User-message',message);
    localStorage.setItem('messages-1',message)
    localStorage.setItem('classname-1', className)
}

// to--- fix reload screnn while there's messages
// and--- if there is existing message keep it 
// or--- click new chat to clear the local storage form the last element
const NewChat = document.getElementById('New-Chat');
NewChat.addEventListener('click', ()=>{
    localStorage.setItem('User-message','');
    localStorage.setItem('AI-message', '');
    location.reload();
});

const text_animation = document.getElementById('text-animation');
let y = localStorage.getItem('User-message');
let x = localStorage.getItem('AI-message');
if(x && y){
    text_animation.style.display = 'none';
    appendMessage(x, 'ai-message');
    appendMessage_user(y, 'user-message');
}
else{
    text_animation.style.display = 'block';
}

function Classifier(){
    const get_btn_content = document.getElementById('logout-btn-text').textContent;
    if(get_btn_content == 'Logout'){
        logout_user();
    }
    else{
        login_user();
    }
}
        
function logout_user(){
    fetch('http://localhost:3307/logout', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }, credentials: 'include' }).then(() => {
        window.location = "http://localhost:5173/login?state=login";
    })
    .catch(err => console.log('Error during logout:', err));
}

function login_user(){
   window.location = `http://localhost:5173/login?state=login`;
}

function feature(){
    window.location = 'http://localhost/AI_Chat_Page/AI-mind-feature.HTML';
}

function help(){
    window.location = 'http://localhost/AI_Chat_Page/AI-mind-help.HTML';
}

// --------------finally-save the messages on refresh------------

/*window.onload =  function Fetch_And_Save(){
    const text_animation = document.getElementById('text-animation');

    // for User append -------------------------------------
    let message_1 = localStorage.getItem('messages-1');
    let classname_1 = localStorage.getItem('classname-1');

    if(message_1 && classname_1){
        text_animation.style.display = 'none';
        const messageArray = message_1.split('||');
        messageArray.forEach(message => {
            appendMessage_user(message, classname_1);
        });
        
    }
    else{
        text_animation.style.display = 'block';
    }
    

    // for AI append ---------------------------------------
    let message_2 = localStorage.getItem('messages-2');
    let classname_2 = localStorage.getItem('classname-2');
    appendMessage(message_2, classname_2);
}*/


//---------------settings----menu---------------------------------
const click = document.getElementById('setting_btn');
click.addEventListener('click', () => {
    const one = document.getElementById('setting_toggle');
    if (one.style.visibility === 'visible') {
        one.style.visibility = 'hidden';  
    } else {
        one.style.visibility = 'visible'; 
    }
});

//---Save chat-- and-- save dark-mode--------------------------------
const toggleSwitch = document.getElementById('dark-mode-toggle');
const save_chat_toggle = document.getElementById('save-mode-toggle');
const install_icon = document.getElementById('power_img');
const menu_icon = document.getElementById('menu');
const direction_icon = document.getElementById('idea');
const question_icon = document.getElementById('question');
const setting_icon = document.getElementById('setting');
const send_icon = document.getElementById('next');
const profile_close_btn = document.getElementById('close-profile');
const logout_img = document.getElementById('logout-img');
const brain_img = document.getElementById('brain-img');
const darkImg = document.getElementById('dark-img');
const saveImg = document.getElementById('save-img');
const recentImg = document.getElementById('recent-img');

if(localStorage.getItem('saveMode') === 'enabled'){
    save_chat_toggle.checked = true;
}


save_chat_toggle.addEventListener('change', () => {
    if(save_chat_toggle.checked) {
        localStorage.setItem('saveMode', 'enabled'); 
    } else {
        localStorage.setItem('saveMode', 'disabled');
    }

    
});

//add to recent------------------------------------------------------
const addedMessages = new Set();

function recent_chat(message){
    if (localStorage.getItem('saveMode') === 'enabled') { 
        if (addedMessages.has(message)) {
            console.log('Message already added:', message);
            return; 
        }addedMessages.add(message);

        const span_recent = document.createElement('span');
        const divappend = document.getElementById('recent_chat');
        const messageIcon = document.createElement('i');
        const settingIcon = document.createElement('i');
        const trash_delete = document.createElement('i');
        const settingDiv = document.createElement('div');
        const deleteLable = document.createElement('label');

        span_recent.className = 'span_recent';
        messageIcon.className = 'fas fa-comment';
        settingIcon.className = 'fas fa-ellipsis-v';
        settingDiv.className = 'settingDiv_settingIcon';
        trash_delete.className = 'fas fa-trash';

        deleteLable.textContent = 'Delete';
        
        trash_delete.id = 'trash_delete';
        settingDiv.id = 'settingDiv_settingIcon';
        deleteLable.id = 'trash_delete';
        messageIcon.id = 'recent_chat_icon';
        settingIcon.id = 'recent_settingIcon';
        
        if(message.substring(0, 15)){
            span_recent.textContent =  message.substring(0, 15) + '...';
        }
        span_recent.appendChild(settingIcon);
        span_recent.appendChild(messageIcon);
        divappend.appendChild(span_recent);

        deleteLable.style.fontFamily = 'system-ui';
        settingDiv.appendChild(deleteLable);
        settingDiv.appendChild(trash_delete);
        settingIcon.appendChild(settingDiv);

        messageIcon.addEventListener('click', (event)=>{
            // location.reload();
            event.stopPropagation();
            load_messag_on_chatArea(message);
            callback_for_recent_response(message);
        });

        settingIcon.addEventListener('click', (event)=>{
            if(settingDiv.style.visibility === 'hidden'){
                settingDiv.style.visibility = 'visible';
                deleteLable.addEventListener('click',()=>{
                    event.stopPropagation();
                    divappend.removeChild(span_recent);
                    removeRecentMessage(message);
                });
            }
            else{
                settingDiv.style.visibility = 'hidden';
            }
            
        });
    }
}

let Global_email = ''
async function fetch_start(message){
    console.log("Fetching...");
    const response = await fetch('http://localhost:3307/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const email = data.Email; 
    Global_email = email;
    console.log('fetch start: ', email);

    retrieve_messeges(email);

    if(message !== ''){
        const message_true = message;
        addRecentMessage(message_true, email);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Page Loaded!');
    for (let i = 0; i < 1; i++) {
        fetch_start();
    }
});

async function addRecentMessage(Message, Email) {
    console.log("addRecentMessage has: ", Message, Email);
    const email = Email;
    const message = Message;
    if(localStorage.getItem('saveMode') === 'enabled'){
        try {
            const responses = await fetch('http://localhost:3307/api/save-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ message, email }),
            });

            if (!responses.ok) {
                throw new Error(`HTTP error! status: ${responses.status}`);
            }

            const result = await responses.json();
            console.log('Message saved:', result);
        
        } catch (error) {
            console.error(error);
          }
    }
}

async function retrieve_messeges(Email) {
    try {
        const email = Email; 
        const response = await fetch(`http://localhost:3307/api/get-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({email}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data: ', data);
        console.log('the retrieved message is: ' + data.messages);
        if (data.allMessages) {
            const allMessages = data.allMessages;
                allMessages.forEach(message => {
                recent_chat(message); 
            });
        } else {
            console.log('No messages found or error:', data.error);
        }
    } catch (error) {
        console.error(error);
    }
}


async function removeRecentMessage(messageToRemove) {
    let existingMessages = localStorage.getItem('recent');
    
    if (existingMessages) {
        let messagesArray = existingMessages.split("||").filter(message => message !== messageToRemove);
        let updatedMessages = messagesArray.join("||");
        localStorage.setItem('recent', updatedMessages);
    }

    try {
        const responses = await fetch('http://localhost:3307/api/removeMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ messageToRemove, Global_email }),
        });

        if (!responses.ok) {
            throw new Error(`HTTP error! status: ${responses.status}`);
        }

        const result = await responses.json();
        console.log('Message removed:', result);
    
} catch (error) {
    console.error(error);
}

}

// -----------load in chat area ------------------------------------
function load_messag_on_chatArea(message){

    const text_animation = document.getElementById('text-animation');

    let User_className = localStorage.getItem('classname-1');
    let existingMessages_for_user = localStorage.getItem('messages-1');
    let newMessages_2 = existingMessages_for_user;
    // for user

    if(newMessages_2){
        text_animation.style.display = 'none';
        appendMessage_user(message, User_className); 
    }
    else{
        text_animation.style.display = 'block';
    }
} 


// ----------------set dark and light mode for the icon-------
if (localStorage.getItem('darkMode') === 'enabled') {
    toggleSwitch.checked = true;
    document.body.classList.add('dark-mode');
    install_icon.src = 'icon/download_gray.png';
    menu_icon.src = 'icon/menu_gray.png';
    direction_icon.src = 'icon/direction_gray.png';
    question_icon.src = 'icon/question_gray.png';
    setting_icon.src = 'icon/setting_gray.png';
    send_icon.src = 'icon/next _gray.png';
    profile_close_btn.src = 'icon/close_gray.png';
    logout_img.src = 'icon/logout_gray.png';
    brain_img.src = 'icon/brainnew_gray.png';
    darkImg.src = 'icon/sleep-mode_gray.png';
    saveImg.src = 'icon/bookmark_gray.png';
    recentImg.src = 'icon/recent_gray.png';
}

toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        install_icon.src = 'icon/download_gray.png';
        menu_icon.src = 'icon/menu_gray.png';
        direction_icon.src = 'icon/direction_gray.png';
        question_icon.src = 'icon/question_gray.png';
        setting_icon.src = 'icon/setting_gray.png';
        send_icon.src = 'icon/next _gray.png';
        profile_close_btn.src = 'icon/close_gray.png';
        logout_img.src = 'icon/logout_gray.png';
        brain_img.src = 'icon/brainnew_gray.png';
        darkImg.src = 'icon/sleep-mode_gray.png';
        saveImg.src = 'icon/bookmark_gray.png';
        recentImg.src = 'icon/recent_gray.png';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        install_icon.src = 'icon/download.png';
        menu_icon.src = 'icon/menu (1).png';
        direction_icon.src = 'icon/direction.png';
        question_icon.src = 'icon/question.png';
        setting_icon.src = 'icon/setting.png';
        send_icon.src = 'icon/B_next.png';
        profile_close_btn.src = 'icon/close.png';
        logout_img.src = 'icon/logout.png';
        brain_img.src = 'icon/brainnew.png';
        darkImg.src = 'icon/sleep-mode.png';
        saveImg.src = 'icon/bookmark.png';
        recentImg.src = 'icon/recent.png';
    }
});


//-------------click-profile----------------------------
const profile = document.getElementById('profile_img');
const show_profile = document.getElementById('profile-view');
profile.addEventListener('click', () =>{
    if(show_profile.style.visibility === 'hidden'){
        show_profile.style.visibility = 'visible';
        if(show_profile.style.visibility === 'visible'){
            span1.style.display = 'none';
        } 
    }
    else{
        show_profile.style.visibility = 'hidden';
        if(show_profile.style.visibility === 'hidden'){
            span1.style.display = 'block';
        }
    }
});

const profile_avatar = document.getElementById('avatar-2');

profile_avatar.addEventListener('click', () =>{
    const show_profile = document.getElementById('profile-view');
    if(show_profile.style.visibility === 'hidden'){
        show_profile.style.visibility = 'visible';
        if(show_profile.style.visibility === 'visible'){
            span1.style.display = 'none';
        } 
    }
    else{
        show_profile.style.visibility = 'hidden';
        if(show_profile.style.visibility === 'hidden'){
            span1.style.display = 'block';
        }
    }
});

const close_profile = document.getElementById('profile-close-btn');
    close_profile.addEventListener('click', () =>{
    show_profile.style.visibility = 'hidden';
});

//-----Hide --- Border after animation is finished-----------------
const textElement = document.getElementById('textSpan');
textElement.addEventListener('animationend', () => {
    textElement.style.borderRight = 'none';
});


//------download--your-coversation----------------
let counter_file = 0;
document.getElementById('download_button').addEventListener('click', () => {
    counter_file++;
    download_conversation(`AImind-conversation-${counter_file}.txt`, content_text);
});

function download_conversation(filename, content_text) {
    if (content_text) {
        const tempElement = document.createElement('textarea');
        tempElement.innerHTML = content_text;
        let formatted_Message_txt = tempElement.value;

        formatted_Message_txt = formatted_Message_txt.replace(/<br>/g, '\n');

        const link = document.createElement('a');
        const blob = new Blob([save_user_input_to_the_txt_file + '\n\n' + 'AI mind:\n' + formatted_Message_txt], { type: 'text/plain' });
        link.download = filename;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}










