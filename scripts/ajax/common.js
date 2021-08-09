function ajaxRetry(ajaxName, errorMessage, status) {
    let array = [];
    let ajaxFunction;
    let doLoad = false;
    const isValidMessage = (!!errorMessage && !StringUtils.isBlank(errorMessage));

    if (ajaxName === AJAX.POST_MESSAGE){
        array = thisMessage;
        ajaxFunction = sendMessage;
        doLoad = true; 

    }  else if (ajaxName === AJAX.POST_PARTICIPANTS){
        array = thisUser;
        ajaxFunction = joinRoom;
        doLoad = true;
    }

    if(array.retries >= CONFIG.MAX_RETRIES){

        array.retries = 0;

        if (ajaxName === AJAX.POST_MESSAGE) {
            if (!status && status !== STATUS_CODE.NETWORK_ERROR){
                const inputMessage = document.querySelector("div.container-send-message input");
                inputMessage.value = "";
            }

            if (isValidMessage) { alert(errorMessage); }
        }

        if (ajaxName === AJAX.POST_PARTICIPANTS) {
            if (isValidMessage && WINDOWS.CURRENT === WINDOWS.LOGIN){
                const tvError = document.querySelector(".window-login div.center span.error");
                tvError.innerHTML = errorMessage;
            }

            if (WINDOWS.CURRENT === WINDOWS.CHAT){
                alert("Você não está logado na sala.");
                toggleWindowLogin(ENABLED);
            }
        }

        if (doLoad) { loading.stop(); }
        
    } else if (array.retries < CONFIG.MAX_RETRIES){
        if (doLoad) { loading.start(); }
        array.retries++;
        setTimeout(ajaxFunction, CONFIG.DELAY_RETRY);
    }

}

function getErrorStatusCode(error){
    if (!error.response){
        return STATUS_CODE.NETWORK_ERROR;
    } else {
        return error.response.status;
    }
}

