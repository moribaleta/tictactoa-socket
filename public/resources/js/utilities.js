class Utilities {
    /**generates random string from length */
    static genID(length) {
        var result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const d = Date.parse(new Date());
        return result + "-" + d;
    } //genID

    /** generates an key for models */
    static keyGenID(prefix, length = 5) {
        return prefix + "-" + this.genID(length) + "-" + Date.now()
    }

    /**generates random value between min and max */
    static getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * converts the object from firebase object to json normalized object
     * @param {*} object 
     * @returns 
     */
    static parseObject(object){
        Object.keys(object).filter((key) => {
            return key.includes('date')
        }).forEach((key) => {
            try {
                let date = new Date(object[key].toDate())
                object[key] = date
            } catch (err) {
                try {
                    if (object[key].seconds &&
                        object[key].nanoseconds) {
                        let timestamp = new firebase.firestore.Timestamp(object[key].seconds,
                            object[key].nanoseconds)
                        object[key] = new Date(timestamp.toDate())
                    } else {
                        object[key] = new Date(object[key])
                    }
                } catch (err) {
                }
            }
        })
        return object
    }//parseObject
    

}//Utilities
