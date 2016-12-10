/**
 * created by 2016-12-10
 * */

/**
 * 状态设定
 * */

    //进行中
var PENDING = 0,

    //成功
    FULFILLED = 1,

    //失败
    REJECTED = 2;


// Promise 对象
function Promise () {

        //存储状态
    var state = PENDING,

        //执行完成后，记录执行结果
        value = null,

        //存储成功或者失败时执行的操作，通过调用then或者done
        handlers = [];


    function fulfill (result) {
        state = PENDING;
        value = result;
        handlers.forEach(handle);
        handlers = null;
    }

    function reject (error) {
        state = REJECTED;
        value = error;
        handlers.forEach(handle);
        handlers = null;
    }

    function resolve (result) {
        try {
            var then = getThen(result);

            if (then) {
                doResolve(then.bind(result), resolve, reject);

                return;
            }
            fulfill(result);
        } catch (e) {
            reject(result);
        }
    }

    function handle (handler) {
        if (state === PENDING) {
            handlers.push(handler);
        } else {
            if (state === FULFILLED && typeof handler.onFulfilled === 'function') {
                handler.onFulfilled(value);
            }

            if (state === REJECTED && typeof handler.onRejected === 'function') {
                handler.onRejected(value);
            }
        }
    }

    this.done = function (onFulfilled, onRejected) {

        //确保程序总是异步的
        setTimeout(function () {
            handle({
                onFulfilled: onFulfilled,
                onRejected: onRejected
            });
        });
    }

    this.then = function (onFulfilled, onRejected) {
        var self = this;

        return new Promise(function (resolve, reject) {
            return self.done(function (result) {
                if (typeof onFulfilled === 'function') {
                    try {
                        return resolve(onFulfilled(result));
                    } catch (e) {
                        return reject(e);
                    }
                } else {
                    return resolve(result);
                }
            }, function (error) {
                if (typeof onRejected === 'function') {
                    try {
                        return resolve(onRejected(error));
                    } catch (e) {
                        return reject(e);
                    }
                } else {
                    return reject(error);
                }
            });
        });
    }

    doResolve(fn, resolve, reject);
}

/**
 * 处理潜在的不对的resolver函数，并且保证 onFulfilled 和 onRejected 只被执行一次
 * 不保证异步
 *
 * @param {Function}
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 * */

function doResolve (fn, onFulfilled, onRejected) {
    var done = false;

    try {
        fn(function (value) {
            if (done) return;
            done = true;
            onFulfilled(value);
        }, function (result) {
            if (done) return;
            done = true;
            onRejected(result);
        });
    } catch (e) {
        if (done) return;
        done = true;
        onRejected(result);
    }
}

/**
 * 判断入参是否是Promise对象
 * 如果是，则返回这个对象的then方法
 *
 * @param {Function|any} value
 * @return {Function|null}
 * */

function getThen (value) {
    var t = typeof value;

    //是Promise对象
    if (value && (t === 'object' || t === 'function')) {
        var then = value.then;

        if (typeof then === 'function') {
            return then;
        }
    }

    //不是，则返回null
    return null;
}