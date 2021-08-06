const StringUtils = {
    isBlank: (string) => {
        if (!string || string.replace(/ /g, "") === "") {
            return true;
        } else {
            return false;
        }
    },
    removeAllTags: (string) => {
        return string.replace(/<[^>]*>/g, '');
    }
}