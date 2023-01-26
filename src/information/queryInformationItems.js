const requestModule = require('request');

const queryInformation = require('./repositories/queryInformationRepository')

module.exports = (query) => new Promise((resolve, reject) => {
    queryInformation(query).then((items) => {
        resolve(items);
    }).catch((error) => { reject(error); })
});