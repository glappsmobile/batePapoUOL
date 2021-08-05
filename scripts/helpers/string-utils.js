const StringUtils = {
    isBlank: (string) => {
        if (!string || string.replace(/ /g, "") === "") {
            return true;
        } else {
            return false;
        }
    },
    secondsToMMSS: (seconds) => {
        return (seconds-(seconds%=60))/60+(9<seconds?':':':0')+seconds;
    }
}