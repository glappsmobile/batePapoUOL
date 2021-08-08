/* TODO:
*   user name too big on list
*   user name too big on spanto
*   freeze some arrays
*   img loading not move butto nand input
*   multiline user name decreasing icon size
*   melhorar nome dos inputs e buttons
*   reduce caracters to 14 input name
*   fix auto scroll
*   transition to div center login
*   send message icon need a max-width
*   input message going on bate papo if mobile keyboard opens
*   send message button not centered vertically
*   set max-size for user list
*   move up container message when mobile keyboard opened
*   on desktop side bar can be permanent
*   increase clickable area of side bar menu
*/

function onLoad(){
    initialConfig();
    //toggleMessagesVisibility(MESSAGE_TYPE.STATUS);
    //const inputName = document.querySelector("section.window-login div.center input");
    // inputName.value = "Preguiçoso Num. "+ (Math.random() * 100000).toFixed();
    // joinRoom(); 
    //retrieveMessages();


   /*const viewWindowsLogin  = document.querySelector("section.window-login");
  
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
    }

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

    if (WINDOWS.CURRENT === WINDOWS.CHAT){
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

function treatText(text){
    let treatedText = StringUtils.removeAllTags(text);

    return treatedText;
}

function toggleMenuRight(){
    const menuRight = document.querySelector("aside.menu-right");
    menuRight.classList.toggle("active");
    toggleOverlay();
}

function toggleOverlay(){
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("active");
}


