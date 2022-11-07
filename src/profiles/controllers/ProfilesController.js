const getSearchProfilesRepository = require('../repositories/getSearchProfilesRepository');
const storeSearchProfilesRepository = require('../repositories/storeSearchProfilesRepository');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));

};

module.exports = () => ({

    registerGetSearchProfiles: (fastify) => {
        fastify.get('/api/search-profiles', async (request, reply) => {
            const { userId } = request.query;
            await getSearchProfilesRepository(userId)
                .then((searchProfiles) => { reply.code(200).send(searchProfiles); })
                .catch((error) => { console.log(error); replyWithInternalError(reply, error); });
        });
    },
    registerStoreSearchProfile: (fastify) => {
        fastify.put('/api/search-profile', async (request, reply) => {
            reply.type('application/json');

            const { searchProfile, userId } = request.body;

            storeSearchProfilesRepository(userId, searchProfile)
                .then(() => { reply.code(200).send({}); })
                .catch(error => replyWithInternalError(reply, error));

        });
    }

});
