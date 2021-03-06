/*
 * @Author: Nico 
 * @Date: 2018-03-08 16:16:23 
 * @Last Modified by: Nico
 * @Last Modified time: 2018-03-08 17:28:12
 */
const assert = require('assert');
const path = require('path');
const ProxyModel = require('../lib/ProxyModel');

describe('singleRequest', () => {

    let pm = new ProxyModel(path.resolve(__dirname, '../interface.json'));

    it('singleRequest -> response', async() => {

        let response = await pm.send('getZhiHuData');

        assert.ok(response != null);
    });

    it('singleRequestExtend -> response', async() => {

        let response = await pm.send('getTaoBaoContent', null, { q: '卫衣', code: 'utf-8' })

        assert.ok(response != null);

    });

})