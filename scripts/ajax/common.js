function ajaxRetry(ajaxName, alertMessage) {
    let array = [];
    let ajaxFunction;
    let doLoad = false;
    const isValidMessage = (!!alertMessage && !StringUtils.isBlank(alertMessage));

    if (ajaxName === AJAX.POST_MESSAGE){
        array = thisMessage;
        ajaxFunction = sendMessage;
    }

    if(array.retries >= CONFIG.MAX_RETRIES){

        array.retries = 0;

        if (ajaxName === AJAX.POST_MESSAGE) {
            const inputMessage = document.querySelector("div.container-send-message input");
            inputMessage.value = "";
        }

        if (isValidMessage){ alert(alertMessage); }
        
    } else if (array.retries < CONFIG.MAX_RETRIES){
        if (doLoad) { loading(true); }
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