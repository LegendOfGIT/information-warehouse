const getTranslationsRepository = require('../repositories/getTranslationsRepository');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

module.exports = () => ({
    registerGetTranslations: (fastify) => {
        fastify.get('/api/translations', async (request, reply) => {
            reply.type('application/json');

            const { locale } = request.query;

            await getTranslationsRepository(locale).then(async (translations) => {
                reply.code(HTTP_STATUS_CODE_OK).send(translations);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    }
});
