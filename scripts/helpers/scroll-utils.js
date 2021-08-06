const ScrollUtils = {
            getDistanceFromBottom: (view) => {
                const distance = view.scrollHeight - view.clientHeight - view.scrollTop;
                return distance;
            },
            scrollToBottom: (view) => {
                view.scrollTop = view.scrollHeight;
            }
}