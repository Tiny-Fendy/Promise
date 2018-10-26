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

function returnPromise(callback, state, msg) {
    if (typeof callback === 'function') {
        try {
            const out = callback(msg);

            if (out instanceof PromiseF) {
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
        const callback = this.state === Resolve ? res : rej;

        return returnPromise(callback, this.state, this.msg);
    },

    catch(callback) {
        if (this.state === Reject) {
            return returnPromise(callback, this.state, this.msg);
        } else {
            return getPmByState(this.state, this.msg);
        }
    },

    // finally的表现与then一致，只不过不区分状态
    finally(callback) {
        return returnPromise(callback, this.state, this.msg);
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
    return new PromiseF((res) => { res(msg) });
};

PromiseF.reject = msg => {
    return new PromiseF((res, rej) => { rej(msg) });
};

module.exports = PromiseF;
