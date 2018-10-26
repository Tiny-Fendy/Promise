const assert = require('power-assert');
const Promise = require('../code/promise');

const resP = new Promise(res => {
    setTimeout(() => {
        res(123);
    });
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

    });

    it('resolve && reject', () => {

    });
});
