const ArrayUtils = {
    getIndexByAttr: (array, attr, value) => {
            let index = -1;

            array.forEach((object, i) => {
                if(object[attr] === value) {
                    index = i;
                }
            });
            
            return index;
    },
    getFirstIndexByValue: (array, value) => {
        array.forEach((itemValue, i) => {
            console.log(itemValue, value);
            if(itemValue === value) {
                console.log("achei")
                return i;
            }
        });

        return -1;
    },
    isEqual: (array1, array2) => {
        if (JSON.stringify(array1) === JSON.stringify(array2)){
            return true;
        }
        return false;
    }
}