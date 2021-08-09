function joinRoomSuccess(){
    const tvError = document.querySelector(".window-login div.center span.error");
    tvError.innerHTML = "";

    retrieveMessages();
    getUsers();

    const intervalUpdateMessagesId = setInterval(retrieveMessages, 3000);
    const intervalUpdateUsersId = setInterval(getUsers, 3000);
    const intervalKeepActiveId = setInterval(keepActive, 5000);

    intervals.push({name: UPDATE_MESSAGES, id: intervalUpdateMessagesId, retries: 0});
    intervals.push({name: UPDATE_USERS, id: intervalUpdateUsersId, retries: 0});
    intervals.push({name: KEEP_ACTIVE, id: intervalKeepActiveId, retries: 0});
}

function joinRoomError(error){
    loading(false);
    thisUser.name = undefined;
    const inputName = document.querySelector(".window-login div.center input.join");
    const status = getErrorStatusCode(error);

    let retry = false;
    let errorMessage = undefined;

    switch (status){
        case STATUS_CODE.BAD_REQUEST:
            errorMessage = "Nome de usuário inválido ou já existe.";
            break;
        case STATUS_CODE.UNPROCESSABLE_ENTITY:
            errorMessage = "Nome de usuário inválido.";
            break;    
        default:
            errorMessage = "Erro ao entrar, tente novamente mais tarde.";
            retry = true;
            break;
    }

    if (retry){
        ajaxRetry(AJAX.POST_PARTICIPANTS, errorMessage, status);
    } else {

        if (WINDOWS.CURRENT === WINDOWS.LOGIN){
            const tvError = document.querySelector(".window-login div.center span.error");
            tvError.innerHTML = errorMessage;
            inputName.value = "";
        } else {
            alert("Você não está logado na sala.");
            toggleWindowLogin(ENABLED);
        }

        loading(false);
    }
}

function joinRoom(isRejoining){
    
    if (!checkInternet(true)) {return;}
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
            joinRoomSuccess();
            sendMessage();
        }
    }

    if (!StringUtils.isBlank(thisUser.name)){
        axios.post(API_URL.PARTICIPANTS, {name: thisUser.name})
        .then(funSuccess)
        .catch(joinRoomError);
    } else {
        const error = {response: {status: STATUS_CODE.UNPROCESSABLE_ENTITY}};
        joinRoomError(error);
    }
}

function keepActiveSuccess(response) {
    const intervalIndex = ArrayUtils.getIndexByAttr(intervals, "name", KEEP_ACTIVE);
    intervals[intervalIndex].retries = 0;
}

function keepActiveError(error) {
    let retry = false;

    if (isUserOnline()){
        retry = true;
    } else {
        stopInterval(KEEP_ACTIVE);
    }

    if (retry) {
        const intervalIndex = ArrayUtils.getIndexByAttr(intervals, "name", KEEP_ACTIVE);

        if (intervals[intervalIndex].retries < CONFIG.MAX_RETRIES) {
            intervals[intervalIndex].retries++;
            setTimeout(keepActive, CONFIG.DELAY_RETRY);
        } else {
            stopInterval(KEEP_ACTIVE);
        }
    }
}

function keepActive(){
    
    if (!checkInternet(false)) {return;}

        axios.post(API_URL.STATUS, {name: thisUser.name})
        .then(keepActiveSuccess)
        .catch(keepActiveError);
}