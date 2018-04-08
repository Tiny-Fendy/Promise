/**
 * created by 2016-12-10
 * */

/**
 * Reconstruction by 2018-04-07
 * */

const Pending = 'pending';
const Resolve = 'resolve';
const Reject = 'reject';

function PromiseF(callback) {
    this.state = Pending;
    callback();
}

PromiseF.prototype = {
    then(res, rej) {
        this.state === Reject ? res() : rej();
        return new Promise();
    },

    catch() {

    }
};

PromiseF.all = (array) => {

};

PromiseF.resolve = () => {

};

PromiseF.reject = () => {

};
