/* TODO:
*   user name too big on list
*   user name too big on spanto
*   freeze some arrays
*   img loading not move butto nand input
*   multiline user name deceasing icon
*   disable join button if invalid
*  melhorar nome dos inputs e buttons
*/

const TO_ALL_USERS = "TO_ALL_USERS_USERS";
const KEY_TODOS = "Todos"

const CONFIG = {
    MAX_RETRIES: 3,
    DELAY_RETRY: 1000
}

const hiddenMessages = [
    {type: MESSAGE_TYPE.STATUS,  hidden: false},
    {type: MESSAGE_TYPE.MESSAGE, hidden: false},
    {type: MESSAGE_TYPE.PRIVATE, hidden: false}
];

const WINDOWS = {
    LOGIN: "WINDOW_LOGIN",
    CHAT: "WINDOW_CHAT",
    CURRENT: "WINDOW_LOGIN"
}

let onlineUsers = [];
let intervals = [];
let buttonsState = [
    {name: "join", state: false},
    {name: "send", state: false}
];

let thisUser = {};
let thisMessage = {type: MESSAGE_TYPE.MESSAGE, to: null, retries: 0};
let previousLastMessage = {time: undefined, text: undefined, status: undefined}
let isLoading = false;

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

function isValidTex(text){
    let treatedText = treatText(text);

    if (StringUtils.isBlank(treatedText)){
        return false;
    }

    return true;
}

function disableButtonAndInput(doDisableButton, doDisableInput){
    let input;
    let button;
    let buttonStateIndex;

    if (WINDOWS.CURRENT === WINDOWS.LOGIN){
        button = document.querySelector(".window-login .button-join");
        input = document.querySelector("section.window-login div.center input");
        buttonStateIndex = 0;
    } 
    else if (WINDOWS.CURRENT === WINDOWS.CHAT) {
        button = document.querySelector(".container-send-message .button-send");
        input = document.querySelector("div.container-send-message input");
        buttonStateIndex = 1;
        console.log("chat")
    }

    console.log(`Button ${buttonsState[buttonStateIndex].name} State: ${buttonsState[buttonStateIndex].state}`);

    switch (doDisableButton){
        case 0:
            button.classList.remove("disabled");
            buttonsState[buttonStateIndex].state = false;
            break;
        
        case 1:
            button.classList.add("disabled");
            buttonsState[buttonStateIndex].state = true;
            break;
        
        case 2:
            if (isValidTex(input.value)){
                button.classList.remove("disabled");
                buttonsState[buttonStateIndex].state = false;
            } else {
                button.classList.add("disabled");
                buttonsState[buttonStateIndex].state = true;
            }
            break;
    }

    if (doDisableInput){
        input.disabled = true;
    } else {  
        input.disabled = false;
    }
    
}


function loading(booLoading){
    isLoading = booLoading;
    

    if (WINDOWS.CURRENT === WINDOWS.LOGIN) {
        const imgLoading = document.querySelector("section.window-login div.center img.loading");
        if (booLoading){
            imgLoading.classList.remove("hidden");
        } else {  
            imgLoading.classList.add("hidden");
        }
    }

    if (WINDOWS.CURRENT === WINDOWS.LOGIN){

        if (booLoading){
            disableButtonAndInput(1, 1);
        } else {
            disableButtonAndInput(2, false);
        }
    }
}

function initialConfig(){
    const inputMessage = document.querySelector("div.container-send-message input");
    const inputName = document.querySelector("section.window-login div.center input");
    disableButtonAndInput(1, 0);

    inputName.focus();

    inputName.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (!buttonsState[0].state) { joinRoom(); }
        }

        disableButtonAndInput(2, false);
    });

    inputMessage.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (!buttonsState[1].state) { sendMessage(); }
        }

        disableButtonAndInput(2, false);
    });

}

function clearAllIntervals(){
    intervals.forEach( (interval) => {
        clearInterval(interval.id);
    });
    intervals = [];
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
                return;
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
                return;
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
                return;
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
    const currentLastMessage = messages[messages.length - 1];

    if (!ObjectUtils.isEqual(currentLastMessage, previousLastMessage)) {
        renderMessages(messages);
        previousLastMessage = currentLastMessage;
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
    const intervalUpdateDataId = 
    setInterval( () => {
        retrieveMessages();
        getUsers();
    }, 3000);

    intervals.push({nome: "UPDATE_DATA", id: intervalUpdateDataId});

    getUsers();
    retrieveMessages();
   // keepActive();
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

function joinRoom(isRejoining){
    if (!isLoading){
        clearAllIntervals();

        loading(true);
        let funSuccess;

        if (!isRejoining){
            const inputName = document.querySelector("section.window-login div.center input");
            inputName.value = treatText(inputName.value);
            thisUser.name = inputName.value;
            funSuccess = joinRoomSuccess;
        } else {
            funSuccess = () => {
                sendMessage();
                joinRoomSuccess();
            }
        }

        if (!StringUtils.isBlank(thisUser.name)){
            axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: thisUser.name})
            .then(funSuccess)
            .catch(joinRoomError);
        } else {
            const error = {response: {status: STATUS_CODE.UNPROCESSABLE_ENTITY}};
            joinRoomError(error);
        }
    }
}

function isUserOnline(){
    const isUserOnline = (ArrayUtils.getIndexByAttr(onlineUsers, "name", thisUser.name) !== -1);

    return isUserOnline;
}

function keepActive(){
        const intervalKeepActiveId = setInterval(() => {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: thisUser.name})
        .catch((error => {console.error(`Error keeping active: ${error.response.statusText}`)}));
    }, 5000);

    intervals.push({nome: "KEEP_ACTIVE", id: intervalKeepActiveId});
}

function sendMessageSuccess(response, inputMessage) {
    loading(false);
    //disableButtonAndInput(true, false);
    thisMessage.retries = 0;
    inputMessage.value = "";
    retrieveMessages();
}

function sendMessageError(error, inputMessage){
    loading(false);
    if (isUserOnline()){
        const status = error.response.status;
        console.error(`Send message failed: ${error.response.statusText}`);
        let tryAgain = false;

        if (status === STATUS_CODE.BAD_REQUEST){
            tryAgain = true;            
        }

        if (tryAgain){
    
            if(thisMessage.retries > CONFIG.MAX_RETRIES){
                alert("Mensagem inválida!");
                inputMessage.value = "";
            } else {
                loading(true)
                thisMessage.retries++;
                setTimeout(sendMessage, CONFIG.DELAY_RETRY);
            }

        } else {
            alert("Mensagem inválida!");
            inputMessage.value = "";
        }

    } else if (!isUserOnline()){
        //REJOIN THE ROOM
        joinRoom(true);
    }
}

function sendMessage(){
    loading(true);
    const inputMessage = document.querySelector("div.container-send-message input");
    inputMessage.value = treatText(inputMessage.value);
    const messageText = inputMessage.value;
    let addresse = thisMessage.to;

    if (thisMessage.to === TO_ALL_USERS) {
        addresse = "Todos";
    }

    const message = {from: thisUser.name, to: addresse, text: messageText,  type: thisMessage.type}

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

    //SELECT USER AGAIN AFTER RE-RENDERING USER LIST
    const lastSelectedIndex = ArrayUtils.getIndexByAttr(users, "name", thisMessage.to);
    const lastSelectedUser= listUsers.querySelector(`.user#user-${lastSelectedIndex}`);
    const isPrivateUserLoggedOut = thisMessage.to !== TO_ALL_USERS && thisMessage.type === MESSAGE_TYPE.PRIVATE && lastSelectedIndex === -1;
    
    if (isPrivateUserLoggedOut){
        alert(`${thisMessage.to} saiu da sala.\nVisibilidade da mensagem alterada para: Público.`);
    }

    toggleSelectedUser(lastSelectedUser);
}

function toggleMenuRight(){
    const menuRight = document.querySelector("aside.menu-right");
    menuRight.classList.toggle("active");
    toggleOverlay();
}

function setPrivacy(isPrivate){
    const optionPrivate = document.querySelector("ul.privacy li#private");
    const optionPublic = document.querySelector("ul.privacy li#public");

    if (isPrivate && thisMessage.to !== TO_ALL_USERS && thisMessage.to !== KEY_TODOS){
        optionPrivate.classList.add("selected");
        optionPublic.classList.remove("selected");
        thisMessage.type = MESSAGE_TYPE.PRIVATE;
    }  else {
        optionPublic.classList.add("selected");
        optionPrivate.classList.remove("selected");
        thisMessage.type = MESSAGE_TYPE.MESSAGE;
    }

    if (thisMessage.to === TO_ALL_USERS || thisMessage.to === KEY_TODOS){
        optionPrivate.classList.add("disabled");
    } else {
        optionPrivate.classList.remove("disabled");
    }

    updateSpanTo();
}

function updateSpanTo(){
    const spanTo = document.querySelector(".container-send-message span#to");

    if (thisMessage.to === TO_ALL_USERS || thisMessage.to === KEY_TODOS){
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
            thisMessage.to = TO_ALL_USERS;
            allUsers.classList.add("selected");
        }

    } else {
        setPrivacy(false);
        thisMessage.to = TO_ALL_USERS;
        allUsers.classList.add("selected");
    }

    //FORCE CHECK IF PRIVATE SHOULD BE ENABLED OR DISABLED;
    //RUN updateSpanTo()
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