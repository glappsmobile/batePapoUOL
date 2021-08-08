/* TODO:
*   user name too big on list
*   user name too big on spanto
*   freeze some arrays
*   img loading shouldn't move button and input
*   multiline user name decreasing icon size
*   reduce caracters to 14 input name
*   transition to div.center login
*   send message icon need a max-width
*   input message going over logo if mobile keyboard opens
*   send message button not centered vertically
*   set max-height for user list
*   move up container message when mobile keyboard opened
*   on desktop side bar can be permanent
*   increase clickable area of side bar menu
*   move functions from main to upper level
*   do not change background of disabled input
*/


const randomNames = ["Australopithecus", "Darwin", "Glauco", "Beta Tester", "Driven", "Pirula", "Pelvis", "ImpPlant", "LateNever", "HarpyWitch", "MiGrain", "Possumiss", "Gigadude", "Redemptor", "Astropower", "Plover", "OculusVision", "Dunning", "Kruger"]
const fakeUsers = [];

function onLoad(){
    randomNames.forEach((name) => {
        fakeUsers.push({name});
    })
    initialConfig();
}

function isValidText(text){
   let treatedText = treatText(text);

    if (StringUtils.isBlank(treatedText)){
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

    if (!isOnline && showAlert) { alert("Verifique sua conexão com a internet."); }

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

function loading(booLoading){
    isLoading = booLoading;
    
    if (WINDOWS.CURRENT === WINDOWS.LOGIN) {
        const imgLoading = document.querySelector("section.window-login div.center img.loading");
        imgLoading.classList.toggle("hidden", !isLoading);
        changeButtonAndInputState(DISABLED, !isLoading);
    }

    if (WINDOWS.CURRENT === WINDOWS.CHAT){
        if (isLoading){
            changeButtonAndInputState(DISABLED, DISABLED);
        } else {
            changeButtonAndInputState(AUTO, ENABLED);
        }
    }
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

function toggleOverlay(){
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("active");
}

function initialConfig(){
    const inputMessage = document.querySelector(".container-send-message input.send");
    const inputName = document.querySelector(".window-login input.join");
    inputName.focus();
    changeButtonAndInputState(DISABLED, ENABLED);

    inputName.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (buttonsStates[0].state) { joinRoom(); }
        }

        changeButtonAndInputState(AUTO, ENABLED);
    });

    inputMessage.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            if (buttonsStates[1].state) { sendMessage(); }
        }

        changeButtonAndInputState(AUTO, ENABLED);
    });
}

