/* TODO:
*   
*
*
*/

const TO_ALL = "Todos";

let thisUser = {};
let onlineUsers = [];
let thisMessage = {type: MESSAGE_TYPE.MESSAGE, to: TO_ALL};

const hiddenMessages = [
    {type: MESSAGE_TYPE.STATUS,  hidden: false},
    {type: MESSAGE_TYPE.MESSAGE, hidden: false},
    {type: MESSAGE_TYPE.PRIVATE, hidden: false}
];

const WINDOWS = {
    LOGIN: "WINDOW_LOGIN",
    CHAT: "WINDOW_CHAT",
    CURRENT: ""
}
    
let intervalKeepActive;
let intervalUpdateMessages;
let isLoading = false;
let prevLastMessageTime = "undefined";

function onLoad(){
    initialConfig();
    //toggleMessagesVisibility(MESSAGE_TYPE.STATUS);
    //const inputName = document.querySelector("section.window-login div.center input");
   // inputName.value = "Preguiçoso Num. "+ (Math.random() * 100000).toFixed();
   // joinRoom(); 
    //retrieveMessages();

  /*  const viewWindowsLogin  = document.querySelector("section.window-login");
  
    viewWindowsLogin.classList.add("swipe-left");*/
}

function loading(booLoading){
    WINDOWS.CURRENT = WINDOWS.LOGIN;
    isLoading = booLoading;
    let imgLoading;
    if (WINDOWS.CURRENT === WINDOWS.LOGIN) {
        imgLoading = document.querySelector("section.window-login div.center img.loading");
        if (booLoading){
            imgLoading.classList.remove("hidden");
        } else {  
            imgLoading.classList.add("hidden");
        }
    }
}

function initialConfig(){
    const inputMessage = document.querySelector("div.container-send-message input");
    const inputName = document.querySelector("section.window-login div.center input");
    
    inputName.focus();

    InputUtils.onEnterReleased(sendMessage, inputMessage);
    InputUtils.onEnterReleased(joinRoom, inputName);

}

function toggleMessagesVisibility(type){
    const indexType = ArrayUtils.getIndexByAttr(hiddenMessages, "type", type);

    hiddenMessages[indexType].hidden = !hiddenMessages[indexType].hidden;
    retrieveMessages();
}

function renderMessages(messages){
    const containerMessages = document.querySelector("ul.container-messages");
    containerMessages.innerHTML = "";

    messages.forEach(message => {
        const indexType = ArrayUtils.getIndexByAttr(hiddenMessages, "type", message.type);
        const isTypeHidden = hiddenMessages[indexType].hidden;

        if (!isTypeHidden){
            if (message.type === MESSAGE_TYPE.STATUS){
                containerMessages.innerHTML += `
                <li class="status">
                <span>
                <span class="time">(${message.time})</span>
                <span>&#160;</span>
                <span class="from">${message.from}</span>
                <span class="text">${message.text}</span>
                </span>
                </li>`;
            } 
        
            if (message.type === MESSAGE_TYPE.MESSAGE){
                containerMessages.innerHTML += `
                <li class="message">
                <span>
                <span class="time">(${message.time})</span>
                <span>&#160;</span>
                <span class="from"><en>${message.from}</en> para <en>${message.to}</en>: </span>
                <span class="text">${message.text}</span>
                </span>
                </li>`;
            } 

            if (message.type === MESSAGE_TYPE.PRIVATE){
                containerMessages.innerHTML += `
                <li class="private">
                <span>
                <span class="time">(${message.time})</span>
                <span>&#160;</span>
                <span class="from"><en>${message.from}</en> reservadamente para <en>${message.to}</en>: </span>
                <span class="text">${message.text}</span>
                </span>
                </li>`;
            }
        }
    });       

    const scrollableArea = 100;
    const isInScrollableArea = Boolean(scrollableArea - ScrollUtils.getDistanceFromBottom(containerMessages) >= 0);

    if (isInScrollableArea) { ScrollUtils.scrollToBottom(containerMessages); }

    if (WINDOWS.CURRENT === WINDOWS.LOGIN){
        WINDOWS.CURRENT = WINDOWS.CHAT;
        const viewWindowsLogin  = document.querySelector("section.window-login");
        const inputName = viewWindowsLogin.querySelector("div.center input");
        inputName.blur();
        loading(false);
        ScrollUtils.scrollToBottom(containerMessages);
        viewWindowsLogin.classList.add("swipe-left");
    }
}

function retrieveMessagesSuccess(response){
    const messages = response.data;
    const curLastMessageTime = messages[messages.length - 1].time;
    if (prevLastMessageTime !== curLastMessageTime) {
        renderMessages(messages);
        prevLastMessageTime = curLastMessageTime;
    }
}

function retrieveMessages(){
    axios.get(API_URL.MESSAGES)
    .then(retrieveMessagesSuccess);
}

function treatText(text){
    let treatedText = StringUtils.removeAllTags(text);

    return treatedText;
}

function joinRoomSuccess(){
    intervalUpdateMessages = 
    setInterval( () => {
        retrieveMessages();
        getUsers();
    }, 3000);

    getUsers();
    retrieveMessages();
    keepActive();
}

function joinRoomError(error){
    const tvError = document.querySelector("section.window-login div.center span.error");
    const status = error.response.status;
    const inputName = document.querySelector("section.window-login div.center input");
    inputName.value = "";

    switch (status){
        case STATUS_CODE.BAD_REQUEST:
            tvError.innerHTML = "Nome de usuário inválido ou já existe.";
            break;
        case STATUS_CODE.UNPROCESSABLE_ENTITY:
            tvError.innerHTML = "Nome de usuário inválido.";
            break;    
        default:
            tvError.innerHTML = "Erro ao entrar, tente novamente.";
            inputName.value = thisUser.name;
            break;
    }

    thisUser = {};
    loading(false);
}

function joinRoom(){
    console.log("joinRoom");
    if (!isLoading){
        loading(true);
        const inputName = document.querySelector("section.window-login div.center input");
        inputName.value = treatText(inputName.value);
        thisUser.name = inputName.value;
 
        if (!StringUtils.isBlank(thisUser.name)){
            axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: thisUser.name})
            .then(joinRoomSuccess)
            .catch(joinRoomError);
        } else {
            const error = {response: {status: STATUS_CODE.UNPROCESSABLE_ENTITY}};
            joinRoomError(error);
        }
    }
}

function keepActive(){
        intervalKeepActive = setInterval(() => {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: thisUser.name})
        .catch((error => {console.error(`Error keeping active: ${error.response.statusText}`)}));
    }, 5000);
}

function sendMessageSuccess(response, inputMessage) {
    loading(false);
    inputMessage.value = "";
    retrieveMessages();
}

function sendMessageError(error, inputMessage){
    loading(false);
    const status = error.response.status;
    console.error(`Send message failed: ${error.response.statusText}`);

    if (status === STATUS_CODE.BAD_REQUEST){
        alert("Mensagem inválida!");
        inputMessage.value = "";
    }
}

function sendMessage(){
    loading(true);
    const inputMessage = document.querySelector("div.container-send-message input");
    inputMessage.value = treatText(inputMessage.value);
    const messageText = inputMessage.value;

    const message = {from: thisUser.name, to: thisMessage.to, text: messageText,  type: thisMessage.type}

    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", message)
    .then ( (response)  =>  sendMessageSuccess(response, inputMessage))
    .catch( (error)     =>  sendMessageError(error, inputMessage));
}

function renderUsers(users) {
    const listUsers = document.querySelector("ul.users");
    listUsers.innerHTML = `
    <li class="user" onclick="toggleSelectedUser(null)">
        <div>
            <ion-icon name="people" class="list-icon"></ion-icon>
            <span>Todos</span>
        </div>
        <ion-icon name="checkmark" class="checkmark"></ion-icon>
    </li>`;

    users.forEach((user, i) => {
        if (user.name !== thisUser.name){

            listUsers.innerHTML += `
            <li class="user" id="user-${i}" onclick="toggleSelectedUser(this)">
                <div>
                    <ion-icon name="person-circle" class="list-icon"></ion-icon>
                    <span class="name">${user.name}</span>
                </div>
                <ion-icon name="checkmark" class="checkmark"></ion-icon>
            </li>`;
        }
    });

    const lastSelectedIndex = ArrayUtils.getIndexByAttr(users, "name", thisMessage.to);
    const lastSelectedView = listUsers.querySelector(`.user#user-${lastSelectedIndex}`)
    toggleSelectedUser(lastSelectedView);
}

function toggleMenuRight(){
    const menuRight = document.querySelector("aside.menu-right");
    menuRight.classList.toggle("active");
    toggleOverlay();
}

function setPrivacy(isPrivate){
    const optionPrivate = document.querySelector("ul.privacy li#private");
    const optionPublic = document.querySelector("ul.privacy li#public");

    if (isPrivate && thisMessage.to !== TO_ALL){
        optionPrivate.classList.add("selected");
        optionPublic.classList.remove("selected");
        thisMessage.type = MESSAGE_TYPE.PRIVATE;
    }  else {
        optionPublic.classList.add("selected");
        optionPrivate.classList.remove("selected");
        thisMessage.type = MESSAGE_TYPE.MESSAGE;
    }

    if (thisMessage.to === TO_ALL){
        optionPrivate.classList.add("disabled");
    } else {
        optionPrivate.classList.remove("disabled");
    }

    updateSpanTo();
}

function updateSpanTo(){
    const spanTo = document.querySelector(".container-send-message span#to");

    if (thisMessage.to === TO_ALL){
        spanTo.innerHTML = "";
    } else {

        spanTo.innerHTML = `Enviando para ${thisMessage.to}`;
        if (thisMessage.type === MESSAGE_TYPE.PRIVATE){
            spanTo.innerHTML += " (reservadamente)";
        }
    }

}


function toggleSelectedUser(user) {
    const lastSelectedUser = document.querySelector("ul.users li.user.selected");
    const allUsers = document.querySelector("ul.users li.user:first-child");

    if (lastSelectedUser !== null && lastSelectedUser !== user) { 
        lastSelectedUser.classList.remove("selected"); 
    }
    
    if (user !== null) { 
        user.classList.toggle("selected");

        if(user.classList.contains("selected")){
            const userName = user.querySelector(".name").innerHTML;
            thisMessage.to = userName;
        } else {
            setPrivacy(false);
            thisMessage.to = TO_ALL;
            allUsers.classList.add("selected");
        }

    } else {
        console.log("USUARIO NULO 1")
        setPrivacy(false);
        thisMessage.to = TO_ALL;
        allUsers.classList.add("selected");
    }

    //FORCE CHECK IF PRIVATE OPTION SHOULD BE ENABLED OR DISABLED;
    //RUN updateSpanTo()
    console.log("SET PRIVACY "+ (thisMessage.type === MESSAGE_TYPE.PRIVATE))
    setPrivacy(thisMessage.type === MESSAGE_TYPE.PRIVATE);
}

function toggleOverlay(){
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("active");
}

function getUsers() {
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants")
    .then((response) => {
        if (!ArrayUtils.isEqual(response.data, onlineUsers)){
            onlineUsers = response.data;
            renderUsers(onlineUsers);
        }
    });
}

getUsers();