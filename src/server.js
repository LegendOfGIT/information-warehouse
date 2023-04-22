const configuration = require('./configuration/app-config')();
const informationItemsController = require('./information/controllers/informationItemsController')();
const searchProfilesController = require('./profiles/controllers/ProfilesController')();
const wishlistItemsController = require('./wishlist/controllers/WishlistItemsController')();

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('@fastify/cors'), {});

informationItemsController.registerGetInformationItems(fastify);
informationItemsController.registerGetSampleInformationItemsOfCategories(fastify)
informationItemsController.registerHighlightInformationItem(fastify);
informationItemsController.registerStoreInformationItem(fastify);
informationItemsController.registerStoreInformationItemScoring(fastify);
informationItemsController.registerUnhighlightInformationItem(fastify);

searchProfilesController.registerGetSearchProfile(fastify);
searchProfilesController.registerGetSearchProfiles(fastify);
searchProfilesController.registerStoreSearchProfile(fastify);
searchProfilesController.registerRemoveSearchProfile(fastify);

wishlistItemsController.registerGetWishlistItems(fastify);
wishlistItemsController.registerStoreWishlistItem(fastify);
wishlistItemsController.registerDeleteWishlistItem(fastify);

fastify.listen({ host: configuration.application.host, port: 3002 }, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
