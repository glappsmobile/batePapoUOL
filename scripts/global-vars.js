const STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNPROCESSABLE_ENTITY: 422,
    NETWORK_ERROR: 999
};

const MESSAGE_TYPE = {
    STATUS: "status",
    MESSAGE: "message",
    PRIVATE: "private_message"
}

const API_BASE_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/";
const API_URL = {
    STATUS: API_BASE_URL + "status",
    MESSAGES: API_BASE_URL + "messages",
    PARTICIPANTS: API_BASE_URL + "participants",
}

const WINDOWS = {
    LOGIN: "WINDOW_LOGIN",
    CHAT: "WINDOW_CHAT",
    CURRENT: "WINDOW_LOGIN"
}
const AJAX = {
    POST_MESSAGE: "SEND_MESSAGE",
    GET_MESSAGE: "SEND_MESSAGE",
    POST_STATUS: "SEND_MESSAGE",
    POST_PARTICIPANTS: "POST_PARTICIPANTS",
    GET_PARTICIPANTS: "GET_PARTICIPANTS"
}


const hiddenMessages = [
    {type: MESSAGE_TYPE.STATUS,  hidden: false},
    {type: MESSAGE_TYPE.MESSAGE, hidden: false},
    {type: MESSAGE_TYPE.PRIVATE, hidden: false}
];

//DELAY * RETRIES SHOULD BE SMALLER THAN 3000 
const CONFIG = {
    MAX_RETRIES: 3,
    DELAY_RETRY: 1000
}

const TO_ALL_USERS = "TO_ALL_USERS_USERS";
const KEEP_ACTIVE = "KEEP_ACTIVE";
const UPDATE_USERS = "UPDATE_USERS";
const UPDATE_MESSAGES = "UPDATE_MESSAGES"; 
const DISABLED = 0;
const ENABLED = 1;
const AUTO = 2;
const KEY_TODOS = "Todos"

let intervals = [];
let isLoading = false;
let buttonsStates = [{window: WINDOWS.LOGIN, state: false}, {window: WINDOWS.CHAT, state: false}];
let thisMessage = {type: MESSAGE_TYPE.MESSAGE, to: null, retries: 0}
let previousLastMessage = {time: undefined, text: undefined, status: undefined}