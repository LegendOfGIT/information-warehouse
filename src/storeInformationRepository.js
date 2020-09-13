const mongoClient = require('mongodb').MongoClient;

module.exports = (informationItem) => {
    informationItem = informationItem || {};

    console.log(informationItem.itemId);


    if (!informationItem.itemId) {
        console.log('required itemId is missing');
    }

    mongoClient.connect(
        'mongodb://localhost:27017/information-items',
        {},
        (error, database) => {
            if (error) {
                throw error;
            }

            const collection = database.db().collection('items');
            collection.insertOne(informationItem)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    throw error;
                })
                .finally(() => {
                    database.close();
                });
        }
    );
};
