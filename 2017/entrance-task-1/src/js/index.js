'use strict';

const model = require('./model.json');
const month = require('./components/month.cmp');
const popup = require('./components/popup.cmp');

month.create(model, document.querySelector('.wrapper'));
popup.init();