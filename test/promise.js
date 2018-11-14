const assert = require('power-assert');
const Promise = require('../code/promise');

const resP = new Promise(res => {
    setTimeout(() => {
        res(123);
    }, 100);
});

const resolveP = Promise.resolve('resolve');
const rejectP = Promise.reject('reject');

describe('Promise测试', () => {
    it('正常实例化', async () => {
        assert.ok(typeof resP === 'object', '是个对象');
        assert.ok(typeof resP.then === 'function', '有then函数');
        assert.ok(await resP === 123, 'sv result 123');
    });

    it ('promise then', async () => {
        assert.ok(await resP.then(res => res) === 123, '执行on resolve');
        assert.ok(await rejectP.then(() => {}, rej => rej) === 'reject', '执行on reject');
        assert.ok(await resolveP.then(33424).then(res => res) === 'resolve', 'then不传function不执行');
        assert.ok(await rejectP.then('aaa').then(() => {}, rej => rej) === 'reject', 'then不传function不执行');
    });

    it('reject catch', async () => {
        const c = await resP.then(() => Promise.reject('catch')).catch(res => res);

        assert.ok(c === 'catch', 'catch reject');
        assert.ok(await resolveP.catch(() => 223) !== 223, 'resolve不catch');
        assert.ok(await resP.catch(res => res).then(res => res) === 123, 'catch 返回 一个Promise对象');
    });

    it('promise finally', async () => {
        assert.ok(await resolveP.finally(res => res) === 'resolve', 'resolve执行');
        assert.ok(await rejectP.finally(res => res) === 'reject', 'reject执行');
        assert.ok(await resolveP.finally(() => '123').then(res => res) === '123', 'finally返回promise');
        assert.ok(await rejectP.finally(() => '123').then(res => res) === '123', 'finally返回promise');
    });

    it('promise all', async () => {
        assert.ok((await Promise.all([])).length === 0, '传入空数组返回空数组');
        assert.ok(await Promise.all([resP]).then(res => res[0]) === 123, '数组resolve时返回resolve-Promise');
        assert.ok(await Promise.all('resolve').then(res => res.join('')) === 'resolve', '可以接受字符串');
        assert.ok(await Promise.all([resolveP, rejectP]).catch(res => res[1]) === 'reject', '只要有一个reject那么返回reject');
    });

    it('race', async () => {
        const slow = new Promise(res => {
            setTimeout(() => {
                res('slow');
            }, 500);
        });
        const fast = new Promise(res => {
            setTimeout(() => {
                res('fast');
            }, 200);
        });

        assert.ok(await Promise.race([slow, fast]).then(res => res) === 'fast', '竞速，快的先接受');
    });
});
