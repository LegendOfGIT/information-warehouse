const mongoClient = require('mongodb').MongoClient;
const configuration = require('../../configuration/app-config')();

const HTTP_STATUS_CODE_OK = 200;

module.exports = () => ({
    registerAddNewProperty: (fastify) => {
        fastify.get('/api/information-items/add-title-without-specials', async(request, reply) => {
            reply.type('application/json').code(HTTP_STATUS_CODE_OK);

            function normalizeTitle(str) {
                return str
                    .normalize("NFD")                 // Unicode zerlegen
                    .replace(/[\u0300-\u036f]/g, "") // Diakritika entfernen (é -> e)
                    .replace(/[^\w\s]/g, "")         // Sonderzeichen entfernen
                    .trim();
            }

            let db;
            try {
                db = await mongoClient.connect(`mongodb://${configuration.database.host}:${configuration.database.port}/information-items`);
                const collection = db.collection('items');

                const cursor = collection.find({}, { projection: { _id: 1, title: 1 } });

                const bulkOps = [];

                while (await cursor.hasNext()) {
                    const doc = await cursor.next();

                    if (doc.title) {
                        const normalized = normalizeTitle(doc.title);
                        bulkOps.push({
                            updateOne: {
                                filter: { _id: doc._id },
                                update: { $set: { titleWithoutSpecials: normalized } }
                            }
                        });
                    }

                    // Optional: alle 1000 Updates senden
                    if (bulkOps.length === 1000) {
                        await collection.bulkWrite(bulkOps);
                        bulkOps.length = 0;
                    }
                }

                // Restliche Updates senden
                if (bulkOps.length > 0) {
                    await collection.bulkWrite(bulkOps);
                }

                console.log("Alle Titel erfolgreich aktualisiert.");
            } finally {
                if (db) {
                    await db.close();
                }
            }

            reply.send({});
        });
    }
});
