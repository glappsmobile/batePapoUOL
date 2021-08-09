const loading = {
    isLoading: false,
    start: () => {
        loading.toggle(true);
    },
    stop: () => {
        loading.toggle(false);
    },
    toggle: (booLoading) =>{ 
        loading.isLoading = booLoading;
        if (WINDOWS.CURRENT === WINDOWS.LOGIN) {
            const imgLoading = document.querySelector(".window-login img.loading");
            imgLoading.classList.toggle("hidden", !loading.isLoading);
            changeButtonAndInputState(DISABLED, !loading.isLoading);
        }

        if (WINDOWS.CURRENT === WINDOWS.CHAT){
            if (loading.isLoading){
                changeButtonAndInputState(DISABLED, DISABLED);
            } else {
                changeButtonAndInputState(AUTO, ENABLED);
            }
        }
    }
}

function focusInputSend(){
    console.log("focusing")
    const inputSend = document.querySelector(".container-send-message input.send");
    inputSend.focus();
}

function isValidText(text){
   let treatedText = treatText(text);

    if (StringUtils.isBlank(treatedText)){
        return false;
    }

    if (WINDOWS.CURRENT === WINDOWS.LOGIN && treatedText === "Todos") {
        return false;
    }

    return true;
}

function stopInterval(intervalName){
    const intervalIndex = ArrayUtils.getIndexByAttr(intervals, "name", intervalName);
    clearInterval(intervals[intervalIndex].id);
    intervals = ArrayUtils.removeIndex(intervals, intervalIndex);
}

function checkInternet(showAlert){
    const isOnline = window.navigator.onLine;

    if (!isOnline) { 
        if (showAlert){
            alert("Verifique sua conexão com a internet."); 
        }

        loading.stop();
    }

    return isOnline
}

function changeButtonAndInputState(buttonState, inputState){
    let input;
    let button;
    const buttonStateIndex = ArrayUtils.getIndexByAttr(buttonsStates, "window", WINDOWS.CURRENT);

    if (WINDOWS.CURRENT === WINDOWS.LOGIN){
        button = document.querySelector(".window-login button.join");
        input = document.querySelector(".window-login input.join");
    } 
    else if (WINDOWS.CURRENT === WINDOWS.CHAT) {
        button = document.querySelector(".container-send-message ion-button.send");
        input = document.querySelector(".container-send-message input.send");
    }

    if (buttonState === AUTO){
        if (isValidText(input.value)){
            buttonState = ENABLED;
        } else {
            buttonState = DISABLED;
        }
    }

    input.disabled = !Boolean(inputState);
    buttonsStates[buttonStateIndex].state = buttonState;
    button.classList.toggle("disabled", !Boolean(buttonState));
}

function clearAllIntervals(){
    intervals.forEach( (interval) => {
        clearInterval(interval.id);
    });
    intervals = [];
}

function treatText(text){
    let treatedText = StringUtils.removeAllTags(text);

    return treatedText;
}

function toggleMenuRight(){
    const menuRight = document.querySelector(".menu-right");
    menuRight.classList.toggle("active");
    toggleOverlay();
}

function toggleWindowLogin(doEnable){
    const windowsLogin  = document.querySelector(".window-login");
    const inputName = windowsLogin.querySelector("div.center input");
    loading.stop();
    windowsLogin.classList.toggle("closed", !doEnable);

    if (doEnable){
        WINDOWS.CURRENT = WINDOWS.LOGIN;
        clearAllIntervals();
        changeButtonAndInputState(AUTO, ENABLED);
    } else {
        WINDOWS.CURRENT = WINDOWS.CHAT;
        const containerMessages = document.querySelector("ul.container-messages");
        inputName.blur();
        ScrollUtils.scrollToBottom(containerMessages);
        changeButtonAndInputState(DISABLED, ENABLED);
    }
}

function toggleOverlay(){
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("active");
    
}