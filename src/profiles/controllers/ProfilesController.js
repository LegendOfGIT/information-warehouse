const getSearchProfile = require('../getSearchProfile');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

module.exports = () => ({

    registerGetSearchProfile: (fastify) => {
        fastify.get('/api/search-profile', async (request, reply) => {
            const { searchProfileId } = request.query;
            await getSearchProfile(searchProfileId)
                .then((searchProfile) => { reply.code(HTTP_STATUS_CODE_OK).send(searchProfile); })
                .catch((error) => { console.log(error); replyWithInternalError(reply, error); });
        });
    }
});
