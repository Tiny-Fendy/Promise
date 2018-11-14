/**
 * Reconstruction by 2018-04-07
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * */

const Pending = 'pending';
const Resolve = 'resolve';
const Reject = 'reject';

function getPmByState(state, msg) {
    return PromiseF[state === Resolve ? 'resolve' : 'reject'](msg);
}

function listCallback(out, resolve, reject) {
    try {
        if (isPromise(out)) {
            out.then(resolve, reject)
        } else {
            return resolve(out);
        }
    } catch (e) {
        reject(e);
    }
}

function isPromise(p) {
    return (p instanceof PromiseF || p instanceof Promise) && p.then;
}

function returnPromise(callback, state, msg) {
    if (typeof callback === 'function') {
        try {
            const out = callback(msg);

            if (isPromise(out)) {
                return out;
            } else {
                return PromiseF.resolve(out);
            }
        } catch (e) {
            return PromiseF.reject(e);
        }
    } else {
        return getPmByState(state, msg);
    }
}

function PromiseF(callback) {
    let self = this;
    this.state = Pending;
    this.msg = '';
    this.resList = [];
    this.rejList = [];

    function resolve(msg) {
        if (self.state === Pending) {
            self.state = Resolve;
            self.msg = msg;
            self.resList.forEach(fn => {
                fn(msg);
            });
        } else if (self.state === Reject) {
            throw '[error]res, rej不可同时调用';
        }
    }

    function reject(msg) {
        if (self.state === Pending) {
            self.state = Reject;
            self.msg = msg;
            self.rejList.forEach(fn => {
                fn(msg);
            });
        } else if (self.state === Resolve) {
            throw '[error]res，rej不可同时调用';
        }
    }

    try {
        if (typeof callback === 'function') {
            callback(resolve, reject);
        } else {
            reject();
        }
    } catch (e) {
        reject(e);
    }
}

PromiseF.prototype = {
    then(res, rej) {
        if (this.state !== Pending) {
            const callback = this.state === Resolve ? res : rej;

            return returnPromise(callback, this.state, this.msg);
        } else {
            return new PromiseF((resolve, reject) => {
                this.resList.push((msg) => {
                    listCallback(res(msg), resolve, reject);
                });
                this.rejList.push((msg) => {
                    listCallback(rej(msg), resolve, reject);
                });
            });
        }
    },

    catch(callback) {
        return this.then(null, callback);
    },

    // finally的表现与then一致，只不过不区分状态
    finally(callback) {
        return this.then(callback, callback);
    }
};

PromiseF.all = array => {
    if (typeof array !== 'string' && !(array instanceof Array)) {
        return PromiseF.reject(new Error('error'));
    } else if (!array.length) {
        return PromiseF.resolve([]);
    } else if (typeof array === 'string') {
        array = array.split('');
    }

    return new PromiseF((res, rej) => {
        let out = [];
        let flag = 0;
        let is = true;
        const over = (msg, index) => {
            out[index] = msg;
            flag++;
            if (flag >= array.length) {
                is ? res(out) : rej(out);
            }
        };
        array.forEach((p, index) => {
            if (isPromise(p)) {
                p.then(msg => msg, msg => {
                    is = false;
                    return msg;
                }).finally(msg => {
                    over(msg, index);
                });
            } else {
                over(p, index);
            }
        });
    });
};

PromiseF.race = (array) => {
    if (!array.length) {
        return PromiseF.resolve([]);
    } else if (typeof array === 'string') {
        return PromiseF.resolve(array[0]);
    } if (array instanceof Array) {
        return new PromiseF((res, rej) => {
            let flag = true;

            array.forEach(p => {
               if (flag) {
                   p.then(msg => {
                       res(msg, 111);
                   }, msg => {
                       rej(msg);
                   }).finally(() => {
                       flag = false;
                   });
               }
            });
        });
    } else {
        return PromiseF.reject('error');
    }
};

PromiseF.resolve = msg => {
    return new PromiseF((res) => { res(msg) });
};

PromiseF.reject = msg => {
    return new PromiseF((res, rej) => { rej(msg) });
};

module.exports = PromiseF;
