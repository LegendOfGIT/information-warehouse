const configuration = require('../../configuration/app-config')();
const mongoClient = require('mongodb').MongoClient;

module.exports = (hashtagPattern) => new Promise(async (resolve, reject) => {
    mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`)
        .then(database => {
            if(!database) {
                resolve([]);
                return;
            }

            const collection =  database.db().collection('items');

            collection.aggregate([ { $group: { _id: null, uniqueValues: { $addToSet: "$scoring"}}} ]).toArray((err, result) => {
                if (err) {
                    database.close();
                    throw err;
                }

                if (!result || !result.length) {
                    resolve({ items: [] });
                    database.close();
                    return;
                }

                const firstResult = result[0];
                if (!firstResult.uniqueValues || !firstResult.uniqueValues.length) {
                    resolve({ items: [] });
                    database.close();
                    return;
                }

                const hashtags = firstResult
                    .uniqueValues.map(scoring => Object.keys(scoring).filter(key => scoring[key] > 0))
                    .flat()
                    .filter(hashtag =>
                        -1 === ['', 'noprofile', 'WeWannaShop'].indexOf(hashtag) &&
                        ('' === hashtagPattern || -1 !== hashtag.toLowerCase().indexOf(hashtagPattern.toLowerCase())));

                const hashtagsResult = [];
                hashtags.forEach(hashtag => {
                   let hashtagEntry = hashtagsResult.find(hashtagsResult => hashtag === hashtagsResult.hashtag);
                   if (!hashtagEntry) {
                       hashtagEntry = { hashtag, productCount: 0 };
                       hashtagsResult.push(hashtagEntry);
                   }
                   hashtagEntry.productCount += 1;
                });

                hashtagsResult.sort((a, b) => a.productCount > b.productCount ? -1 : 1);

                resolve({ items: hashtagsResult });
                database.close();
            });
        })
        .catch(error => {
            reject(error);
        });
});
