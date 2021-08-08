let onlineUsers = [];
let thisUser = {};


function renderUsers(users) {
    const listUsers = document.querySelector("ul.users");
    listUsers.innerHTML = `
    <li class="user" onclick="toggleSelectedUser(null)">
        <div>
            <ion-icon name="people" class="list-icon"></ion-icon>
            <span>Todos</span>
        </div>
        <ion-icon name="checkmark" class="checkmark"></ion-icon>
    </li>`;

    users.forEach((user, i) => {
        if (user.name !== thisUser.name){

            listUsers.innerHTML += `
            <li class="user" id="user-${i}" onclick="toggleSelectedUser(this)">
                <div>
                    <ion-icon name="person-circle" class="list-icon"></ion-icon>
                    <span class="name">${user.name}</span>
                </div>
                <ion-icon name="checkmark" class="checkmark"></ion-icon>
            </li>`;
        }
    });

    //SELECT USER AGAIN AFTER RE-RENDERING USER LIST
    const lastSelectedIndex = ArrayUtils.getIndexByAttr(users, "name", thisMessage.to);
    const lastSelectedUser= listUsers.querySelector(`.user#user-${lastSelectedIndex}`);
    const isPrivateUserLoggedOut = thisMessage.to !== TO_ALL_USERS && thisMessage.type === MESSAGE_TYPE.PRIVATE && lastSelectedIndex === -1;
    
    if (isPrivateUserLoggedOut){
        alert(`${thisMessage.to} saiu da sala.\nVisibilidade da mensagem alterada para: Público.`);
    }

    toggleSelectedUser(lastSelectedUser);
}

function toggleSelectedUser(user) {
    const lastSelectedUser = document.querySelector("ul.users li.user.selected");
    const allUsers = document.querySelector("ul.users li.user:first-child");

    if (lastSelectedUser !== null && lastSelectedUser !== user) { 
        lastSelectedUser.classList.remove("selected"); 
    }
    
    if (user !== null) { 
        user.classList.toggle("selected");

        if(user.classList.contains("selected")){
            const userName = user.querySelector(".name").innerHTML;
            thisMessage.to = userName;
        } else {
            setPrivacy(false);
            thisMessage.to = TO_ALL_USERS;
            allUsers.classList.add("selected");
        }

    } else {
        setPrivacy(false);
        thisMessage.to = TO_ALL_USERS;
        allUsers.classList.add("selected");
    }

    //FORCE CHECK IF PRIVATE SHOULD BE ENABLED OR DISABLED;
    //RUN updateSpanTo()
    setPrivacy(thisMessage.type === MESSAGE_TYPE.PRIVATE);
}

function getUsers() {

    if (!checkInternet(false)) {return}

    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants")
    .then((response) => {
        if (!ArrayUtils.isEqual(response.data, onlineUsers)){
            onlineUsers = response.data;
            renderUsers(onlineUsers);
        }
    });
}

function isUserOnline(){
    const isUserOnline = (ArrayUtils.getIndexByAttr(onlineUsers, "name", thisUser.name) !== -1);

    return isUserOnline;
}