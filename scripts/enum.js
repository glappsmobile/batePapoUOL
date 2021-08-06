const STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNPROCESSABLE_ENTITY: 422
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