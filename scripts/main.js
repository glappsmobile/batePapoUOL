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
*   do not change background of disabled input
*   two user list to avoi re rendering issues
*/


const randomNames = ["Australopithecus", "Darwin", "Glauco", "Beta Tester", "Driven", "Pirula", "Pelvis", "ImpPlant", "LateNever", "HarpyWitch", "MiGrain", "Possumiss", "Gigadude", "Redemptor", "Astropower", "Plover", "OculusVision", "Dunning", "Kruger"]
const fakeUsers = [];

function onLoad(){
    randomNames.forEach((name) => {
        fakeUsers.push({name});
    })
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


