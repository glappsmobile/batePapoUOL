const ArrayUtils = {
    getIndexByAttr: (array, attr, value) => {
            let index = -1;

            array.forEach((object, i) => {
                if(object[attr] === value) {
                    index = i;
                }
            });
            
            return index;
    }
}