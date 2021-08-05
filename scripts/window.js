const windows = {
    login: {name: "login", id: "WINDOW_LOGIN", view: document.querySelector("section.window-login")},
    chat:  {name: "chat", id: "WINDOW_CHAT", view: undefined},
    currentWindow: {},
    setCurrentWindow: (name) => { 
        const chosenWindow = windows[name];

        if (chosenWindow !== undefined){
            windows.currentWindow = chosenWindow;
        } else {
            console.error(`Window ${name} does not exist.`)
        }
    }
}