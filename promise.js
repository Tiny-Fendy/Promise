/**
 * created by 2016-12-10
 * */

/**
 * Reconstruction by 2018-04-07
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * */

const Pending = 'pending';
const Resolve = 'resolve';
const Reject = 'reject';

function PromiseF(callback) {
    let self = this;
    this.state = Pending;
    this.msg = '';

    function resolve(msg) {
        if (self.state === Pending) {
            self.state = Resolve;
            self.msg = msg;
        } else if (self.state === Reject) {
            throw '[error]res, rej不可同时调用';
        }
    }

    function reject(msg) {
        if (self.state === Pending) {
            self.state = Reject;
            self.msg = msg;
        } else if (self.state === Resolve) {
            throw '[error]res，rej不可同时调用';
        }
    }

    try {
        setTimeout(() => {
            callback(resolve, reject);
        }, 0);
    } catch (e) {
        reject(e);
    }
}

PromiseF.prototype = {
    then(res, rej) {
        res = typeof res === 'function' ? res : function (msg) {};
        rej = typeof rej === 'function' ? rej : function (msg) {};

        try {
            let callback = this.state === Resolve ? res : rej;
            let out = callback(this.msg);

            if (out instanceof PromiseF) {
                return out;
            } else {
                return PromiseF.resolve(out);
            }
        } catch (e) {
            return PromiseF.reject(e);
        }
    },

    catch(rej) {
        return this.then(undefined, rej);
    },

    // finally的表现与then一致，只不过不区分状态
    finally(callback) {
        callback = typeof callback === 'function' ? callback() : callback;

        try {
            if (callback instanceof PromiseF) {
                return callback;
            } else {
                return PromiseF.resolve(this.msg);
            }
        } catch (e) {
            return PromiseF.reject(e);
        }
    }
};

PromiseF.all = array => {
    if (typeof array === 'string') {
        array = array.split('');
    }

    return new PromiseF((res, rej) => {
        let out = [];
        let flag = 0;
        let is = array.every((p, index) => {
            if (p instanceof PromiseF) {
                let isResolved = true;

                p.then(msg => {
                    out[index] = msg;
                    flag++;
                }, msg => {
                    out[index] = msg;
                    flag++;
                    isResolved = false;
                });

                return isResolved;
            } else {
                out[index] = p;
                flag++;

                return true;
            }
        });

        if (flag >= array.length) {
            is ? res(out) : rej(out);
        }
    });
};

PromiseF.resolve = msg => {
    return new PromiseF((res) => {
         res(msg);
    });
};

PromiseF.reject = msg => {
    return new PromiseF((res, rej) => {
        rej(msg);
    });
};
