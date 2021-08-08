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
        disableButtonAndInput(1, 0);
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

function sendMessageSuccess(response, inputMessage) {
    loading(false);
    disableButtonAndInput(1, 0);
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
          //  alert("Mensagem inválida!");
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