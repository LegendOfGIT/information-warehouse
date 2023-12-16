const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (navigationPath, searchPattern) => new Promise((resolve, reject) => {
    if (!searchPattern) {
        resolve([]);
        return;
    }

    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/activities`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection =  database.db().collection('searchRequests');
            const query = { suggestionWithoutSpecials: new RegExp(`${searchPattern}.*`, 'i') };
            if (navigationPath) {
                query.navigationPath = new RegExp(`${navigationPath}.*`);
            }

            const queryParts = [
                { $addFields: { suggestionWithoutSpecials: { $replaceAll: { input: "$suggestion", find: "'", replacement: '' }}}}
            ];

            const specialCharReplacements = {
                '`': '', '´': '', ':': '',
                'á': 'a', 'é': 'e', 'ó': 'o'
            };
            Object.keys(specialCharReplacements).forEach(
                key => queryParts.push({ $addFields: { suggestionWithoutSpecials: { $replaceAll: { input: "$suggestionWithoutSpecials", find: key, replacement: specialCharReplacements[key] }}}}));

            queryParts.push({ $match: query });
            queryParts.push({ $sort: { activityOn: -1 }});

            collection.aggregate(queryParts).toArray().then((result) => {
                console.log(result);
                const suggestions = [...new Set(result.map(item => item.searchPattern))].map(pattern => ({
                    suggestion: pattern,
                    numberOfRequests: result.filter(r => pattern === r.searchPattern).length
                }));
                suggestions.sort((a, b) =>
                    a.numberOfRequests < b.numberOfRequests ? 1 : -1);

                resolve(suggestions);
                database.close().then(() => {});
            }).catch((error) => {
                reject(error);
            })
            .finally(() => {
                database.close().then(() => {});
            });
        })
        .catch(error => {
            reject(error);
        });
});
