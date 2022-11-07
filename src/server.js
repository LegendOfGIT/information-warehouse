const informationItemsController = require('./information/controllers/informationItemsController')();
const searchProfilesController = require('./profiles/controllers/ProfilesController')();
const wishlistItemsController = require('./wishlist/controllers/WishlistItemsController')();

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('@fastify/cors'), {});

informationItemsController.registerGetInformationItems(fastify);
informationItemsController.registerStoreInformationItem(fastify);

searchProfilesController.registerGetSearchProfiles(fastify);
searchProfilesController.registerStoreSearchProfile(fastify);

wishlistItemsController.registerGetWishlistItems(fastify);
wishlistItemsController.registerStoreWishlistItem(fastify);
wishlistItemsController.registerDeleteWishlistItem(fastify);

fastify.listen(3002, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
