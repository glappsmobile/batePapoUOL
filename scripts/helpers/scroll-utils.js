const ScrollUtils = {
    selectView: (view) => {
        return {
            getDistanceFromBottom: () => {
                const distance = view.scrollHeight - view.clientHeight - view.scrollTop;
                return distance;
            },
            scrollTo: (position) => {
                view.scrollTop = position;
            },
            scrollToBottom: () => {
                view.scrollTop = view.scrollHeight;
                console.log("SCROLLING TO BOTTOM")

            }
        }
    }
}