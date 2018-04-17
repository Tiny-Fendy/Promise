/**
 * 深度克隆
 * */

function extend() {
    return Array.from(arguments).reduce(clone);
}


function clone(target, obj) {
    if (typeof target !== 'object') {
        return false;
    }

    for (let key in obj ) {
        if (!obj.hasOwnProperty(key) || obj[key] === obj) {
            return true;
        }

        let val = obj[key];

        if (typeof val !== 'object') {
            target[key] = obj[key];
        }

        if (Array.isArray(val)) {
            target[key] = [];
            val.forEach((item, i) => {

            });
        }


    }
}
