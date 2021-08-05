const FIVE_SECONDS = 5000;

let user = {};
const hiddenMessages = [{type: MESSAGE_TYPE.STATUS, hidden: false}, {type: MESSAGE_TYPE.MESSAGE, hidden: false}, {type: MESSAGE_TYPE.PRIVATE, hidden: false}];
let curWindow = WINDOW.LOGIN;
let intervalActive;
let isLoading = false;

function onLoad(){
    initialConfig();
    //toggleMessagesVisibility(MESSAGE_TYPE.STATUS);
  //  joinRoom("Glauco"); 
    //retrieveMessages();
}

function loading(booLoading){
    isLoading = booLoading;
    let imgLoading;
    switch (curWindow){
        case WINDOW.LOGIN:
            imgLoading = document.querySelector("section.window-login div.center img.loading");
            if (booLoading){
                imgLoading.classList.remove("hidden");
            } else {  
                imgLoading.classList.add("hidden");
            }
            break;
        }
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
          joinRoom.attempt();
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
                case MESSAGE_TYPE.STATUS:
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
                case MESSAGE_TYPE.MESSAGE:
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
                case MESSAGE_TYPE.PRIVATE:
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

    if (curWindow === WINDOW.LOGIN){
        const windowLogin = document.querySelector("section.window-login");
        const inputName = windowLogin.querySelector("div.ctn-center input");
        loading(false);
        windowLogin.classList.add("swipe-left");
        curWindow = WINDOW.CHAT;
    }
}

function isValidName(name){
    let isValid = true;

    if (StringUtils.isBlank(name)){ isValid = false }

    return isValid;
}

function treatError (){

}

const joinRoom = {
    attempt: () => {
        if (!isLoading){
            loading(true);
            const inputName = document.querySelector("section.window-login div.center input");
            user.name = inputName.value;
            if (isValidName(user.name)){
                axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", {name: user.name})
                .then(joinRoom.success)
                .catch(joinRoom.error);
            } else {
                const error = {response: {status: STATUS_CODE.UNPROCESSABLE_ENTITY}};
                joinRoom.error(error);
            }
        }
    },
    success: () => {
        console.log("SUCCESS");
        getUsers();
        retrieveMessages();
        keepActive();
    },
    error: (error) => {
        console.log("ERROR");
        const tvError = document.querySelector("section.window-login div.center span.error");
        const status = error.response.status;
        const inputName = document.querySelector("section.window-login div.center input");
        inputName.value = "";

        switch (status){
            case STATUS_CODE.BAD_REQUEST:
                console.error(`User ${user.name} already exists.`);
                tvError.innerHTML = "Nome de usuário já existe.";
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
}

function keepActive(){
        intervalActive = setInterval(() => {
        axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", {name: user.name})
        .then((response) => {
            const status = response.status;
            console.log(status);
            retrieveMessages();
        });
    }, FIVE_SECONDS);
}


function sendMessage(){
    const input = document.querySelector("div.ctn-send-message input");
    const message = input.value;
    const messageObj = {from: user.name, to: "Todos", text:message,  type: "message"}

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", messageObj);
    promise.then((response) => {
            console.log(messageObj);
            input.value = "";
            retrieveMessages();
    });
}

function getUsers(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants")
    .then((response) => {
        console.log(response.data);
    });
}