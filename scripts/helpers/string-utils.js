const StringUtils = {
    isBlank: (string) => {
        if (!string || string.replace(/ /g, "") === "") {
            return true;
        } else {
            return false;
        }
    }
}