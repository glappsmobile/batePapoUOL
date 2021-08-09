/* TODO:
*   freeze some arrays
*   transition to div.center login
*   input message going over logo if mobile keyboard opens
*   move up container message when mobile keyboard opened
*/

function onLoad(){
    initialConfig();
}

function initialConfig(){
    const inputMessage = document.querySelector(".container-send-message input.send");
    const inputName = document.querySelector(".window-login input.join");
    inputName.focus();
    changeButtonAndInputState(DISABLED, ENABLED);

    inputName.addEventListener("keyup", function(event) {
        changeButtonAndInputState(AUTO, ENABLED);

        if (event.keyCode === 13) {
            event.preventDefault();
            if (buttonsStates[0].state) { joinRoom(); }
        }
    });

    inputMessage.addEventListener("keyup", function(event) {
        changeButtonAndInputState(AUTO, ENABLED);

        if (event.keyCode === 13) {
            event.preventDefault();
            if (buttonsStates[1].state) { sendMessage(); }
        }

    });
}


