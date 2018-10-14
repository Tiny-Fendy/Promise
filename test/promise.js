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
    it('正常实例化', () => {
        assert.ok(typeof resP === 'object', '是个对象');
        assert.ok(typeof resP.then === 'function', '有then函数');
    });

    it('返回值', async () => {
        const resThen = await resP.then(res => res);
        assert.ok(resThen ===123, ' then resolve');

        const sv = await new Promise(res => {
            res(123);
        });
        assert.ok(sv === 123, 'sv result 123');

        const jv = await new Promise((res, rej) => {
            rej(123);
        }).then(() => {}, rej => rej);
        assert.ok(jv === 123, 'jv result 123');
    });

    it ('then值穿透', async () => {
        const resThen = resP.then(res => res);
        const rejThen = resThen.then(res => Promise.reject(res));

        assert.ok(await resThen.then(res => res) === 123, 'res then 123');

        assert.ok(await rejThen.then(() => {}, rej => rej) === 123, 'rej then 123');
    });

    it('reject catch', async () => {
        try {
            await new Promise((res, rej) => {
                rej(123);
            });
        } catch (e) {
            assert.ok(e === 123, 'catch reject')
        }
    });

    it('resolve && reject', () => {

    });
});
