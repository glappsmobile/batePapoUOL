const windows = {
    login: {ID: "WINDOW_LOGIN", view: document.querySelector("section.window-login")},
    chat:  {ID: "WINDOW_CHAT", view: undefined},
    currentWindow: {},
    setCurrentWindow: (id) => { 
        const chosenWindow = this[id];

        if (chosenWindow !== undefined){
            currentWindow = chosenWindow;
        } else {
            console.error(`Window ${id} does not exist.`)
        }
    }
}