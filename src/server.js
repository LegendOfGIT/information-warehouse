const configuration = require('./configuration/app-config')();
const hashtagsController = require('./hashtags/controllers/hashtagsController')();
const informationItemsController = require('./information/controllers/informationItemsController')();
const searchProfilesController = require('./profiles/controllers/ProfilesController')();
const wishlistItemsController = require('./wishlist/controllers/WishlistItemsController')();

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('@fastify/cors'), {});

informationItemsController.registerGetInformationItems(fastify);
informationItemsController.registerGetSampleInformationItemsOfCategories(fastify)
informationItemsController.registerStoreInformationItem(fastify);
informationItemsController.registerStoreInformationItemScoring(fastify);
informationItemsController.registerGetAvailableFilters(fastify);
informationItemsController.registerDiscoverItem(fastify);
informationItemsController.registerGetSearchSuggestions(fastify);
informationItemsController.registerRemoveProvider(fastify);

hashtagsController.registerGetHashtags(fastify);
hashtagsController.registerGetRankedCategoriesByHashtags(fastify);

searchProfilesController.registerGetSearchProfile(fastify);

wishlistItemsController.registerGetWishlistItems(fastify);
wishlistItemsController.registerStoreWishlistItem(fastify);
wishlistItemsController.registerDeleteWishlistItem(fastify);
wishlistItemsController.registerCreateOrUpdateWishlist(fastify);
wishlistItemsController.registerGetWishlists(fastify);
wishlistItemsController.registerGetSingleWishlist(fastify);
wishlistItemsController.registerAddSingleWishlistItem(fastify);
wishlistItemsController.registerUpdateSingleWishlistItem(fastify);
wishlistItemsController.registerRemoveSingleWishlistItem(fastify);
wishlistItemsController.registerDeleteWishlist(fastify);
wishlistItemsController.registerShareWishlist(fastify);
wishlistItemsController.registerCancelShareWishlist(fastify);

fastify.listen({ host: configuration.application.host, port: 3002 }, (err, address) => {
    if (err) throw err
    fastify.log.info(`server listening on ${address}`)
});
