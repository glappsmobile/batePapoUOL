/* TODO:
*   freeze some arrays
*   img loading shouldn't move button and input
*   reduce caracters to 14 input name
*   transition to div.center login
*   send message icon need a max-width
*   input message going over logo if mobile keyboard opens
*   send message button not centered vertically
*   move up container message when mobile keyboard opened
*   increase clickable area of side bar menu
*   do not change background of disabled input
*   loading to obbject
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


