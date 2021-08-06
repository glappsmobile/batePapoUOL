let user = {};
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
    //joinRoom("Glauco"); 
    //retrieveMessages();
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

function retrieveMessages(){
    console.log("retrieveMessages");

    axios.get(API_URL.MESSAGES)
    .then(retrieveMessagesSuccess);
}

function retrieveMessagesSuccess(response){
    const messages = response.data;
    const curLastMessageTime = messages[messages.length - 1].time;
    if (prevLastMessageTime !== curLastMessageTime) {
        renderMessages(messages);
        prevLastMessageTime = curLastMessageTime;
    }
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

function treatText(text){
    let treatedText = StringUtils.removeAllTags(text);

    return treatedText;
}

function joinRoom(){
    console.log("joinRoom");
    if (!isLoading){
        loading(true);
        const inputName = document.querySelector("section.window-login div.center input");
        inputName.value = treatText(inputName.value);
        user.name = inputName.value;
 
        if (!StringUtils.isBlank(user.name)){
            axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: user.name})
            .then(joinRoomSuccess)
            .catch(joinRoomError);
        } else {
            const error = {response: {status: STATUS_CODE.UNPROCESSABLE_ENTITY}};
            joinRoomError(error);
        }
    }
}

function joinRoomSuccess(){
    intervalUpdateMessages = setInterval(retrieveMessages, 3000);
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
            inputName.value = user.name;
            break;
    }

    user = {};
    loading(false);
}

function keepActive(){
        intervalKeepActive = setInterval(() => {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: user.name})
        .catch((error => {console.error("Erro ao manter atividade" + error.response.statusText)}));
    }, 5000);
}

function sendMessage(){
    const inputMessage = document.querySelector("div.container-send-message input");
    inputMessage.value = treatText(inputMessage.value);
    
    const message = inputMessage.value;

    const messageObj = {from: user.name, to: "Todos", text:message,  type: MESSAGE_TYPE.MESSAGE}

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", messageObj);
    promise.then((response) => {
            console.log(messageObj);
            inputMessage.value = "";
            retrieveMessages();
    });
}

function getUsers(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants")
    .then((response) => {
        console.log(response.data);
    });
}