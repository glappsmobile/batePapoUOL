let user = {};
const STATUS_SUCCESS = 200;
const FIVE_SECONDS = 5000;
const TYPE_STATUS = "status";
const TYPE_MESSAGE = "message";
const TYPE_PRIVATE = "private_message";
const WINDOW_LOGIN = "window-login";
const WINDOW_CHAT = "window-chat";
const hiddenMessages = [{type: TYPE_STATUS, hidden: false}, {type: TYPE_MESSAGE, hidden: false}, {type: TYPE_PRIVATE, hidden: false}];
let curWindow = WINDOW_LOGIN;
let intervalActive;

function onLoad(){
    initialConfig();
    //toggleMessagesVisibility(TYPE_STATUS);
  //  joinRoom("Glauco"); 
    //retrieveMessages();
}


function initialConfig(){
    const inputMessage = document.querySelector("div.ctn-send-message input");
    const inputName = document.querySelector("section.window-login div.center input");
    
    inputName.focus();

    inputMessage.addEventListener("keyup", function(event) {
        // WHEN "ENTER" KEY RELEASED, DO: 
        if (event.keyCode === 13) {
          event.preventDefault();
          sendMessage();
        }
    });

    inputName.addEventListener("keyup", function(event) {
        // WHEN "ENTER" KEY RELEASED, DO: 
        if (event.keyCode === 13) {
          event.preventDefault();
          joinRoom();
        }
    });
}

function toggleMessagesVisibility(type){
    const indexType = ArrayUtils.getIndexByAttr(hiddenMessages, "type", type);

    hiddenMessages[indexType].hidden = !hiddenMessages[indexType].hidden;
    retrieveMessages();
}

function retrieveMessages(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    promise.then(renderMessages);
}

function renderMessages(messages){
    messages = messages.data;
    const ctnMessages = document.querySelector("ul.ctn-messages");
    ctnMessages.innerHTML = "";
    messages.forEach(message => {
        const indexType = ArrayUtils.getIndexByAttr(hiddenMessages, "type", message.type);
        if (!hiddenMessages[indexType].hidden){

            switch (message.type){
                case TYPE_STATUS:
                    ctnMessages.innerHTML += `
                    <li class="status">
                    <span>
                    <span class="time">(${message.time})</span>
                    <span>&#160;</span>
                    <span class="from">${message.from}</span>
                    <span class="text">${message.text}</span>
                    </span>
                    </li>`;
                    break;
                case TYPE_MESSAGE:
                    ctnMessages.innerHTML += `
                    <li class="message">
                    <span>
                    <span class="time">(${message.time})</span>
                    <span>&#160;</span>
                    <span class="from"><en>${message.from}</en> para <en>${message.to}</en>: </span>
                    <span class="text">${message.text}</span>
                    </span>
                    </li>`;
                    break;
                case TYPE_PRIVATE:
                    ctnMessages.innerHTML += `
                    <li class="private">
                    <span>
                    <span class="time">(${message.time})</span>
                    <span>&#160;</span>
                    <span class="from"><en>${message.from}</en> reservadamente para <en>${message.to}</en>: </span>
                    <span class="text">${message.text}</span>
                    </span>
                    </li>`;
                    break;

            }
        }

    });                

    ctnMessages.scrollTop = ctnMessages.scrollHeight;

    if (curWindow === WINDOW_LOGIN){
        const windowLogin = document.querySelector("section.window-login");
        windowLogin.classList.add("swipe-left");
        curWindow = WINDOW_CHAT;
    }
}


function joinRoom(){
    const inputName = document.querySelector("section.window-login div.center input");

    user.name = inputName.value;
    console.log(user.name);

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: user.name});
    promise.then((response) => {
        const status = response.status;

        switch (status){
            case STATUS_SUCCESS:
                console.log(`Joining room as ${user.name}`);
                getUsers();
                retrieveMessages();
                keepActive();
                break;
            default:
                console.error(`Failed to join room as ${user.name}: ${response.statusText}`);
                console.log(response);
                user = {};
                break;
        }
    });
}


function keepActive(){
        intervalActive = setInterval(() => {
        const promiseStatus = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: user.name});
        promiseStatus.then((response) => {
            const status = response.status;

            switch (status){
                case STATUS_SUCCESS:
                    retrieveMessages();
                    break;
                default:
                    console.error(`Failed to keep activity`);
                    console.error(response);
                    break;
            }
  
        });
    }, FIVE_SECONDS);
}


function sendMessage(){
    const input = document.querySelector("div.ctn-send-message input");
    const message = input.value;
    const messageObj = {from: user.name, to: "Todos", text:message,  type: "message"}

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", messageObj);
    promise.then((response) => {
        const status = response.status;

        switch (status){
                case STATUS_SUCCESS:
                    console.log(messageObj);
                    input.value = "";
                    retrieveMessages();
                    break;
                default:
                    console.error(`Failed to send message`);
                    console.log(messageObj);
                    console.error(response);
                    break;
        }
    });
}

function getUsers(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");
    promise.then((response) => {
        const status = response.status;
        console.log("Getting online users...");

        switch (status){
            case STATUS_SUCCESS:
                console.log(response.data);
                break;
            default:
                console.error(`Failed to join room as ${user.name}: ${response.statusText}`);
                console.log(response);
                user = {};
                break;
        }

    });
}