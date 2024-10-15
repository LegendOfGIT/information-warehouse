const getStoriesRepository = require('../repositories/getStoriesRepository');
const getSingleStoryRepository = require('../repositories/getSingleStoryRepository');
const removeStoryRepository = require('../repositories/removeStoryRepository');
const saveStoryRepository = require('../repositories/saveStoryRepository');
const getTranslationsRepository = require('../repositories/getTranslationsRepository');
const saveTranslationsRepository = require('../repositories/saveTranslationsRepository');
const constants = require('../../constants');

const HTTP_STATUS_CODE_INTERNAL_ERROR = 500;
const HTTP_STATUS_CODE_OK = 200;

const replyWithInternalError = (reply, errorMessage, additionalInformation) => {
    reply.code(HTTP_STATUS_CODE_INTERNAL_ERROR);
    return reply.send(Object.assign({ errorMessage }, additionalInformation));
};

module.exports = () => ({
    registerGetStories: (fastify) => {
        fastify.get('/api/stories', async (request, reply) => {
            reply.type('application/json');

            await getStoriesRepository().then(async (stories) => {
                reply.code(HTTP_STATUS_CODE_OK).send(stories);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerGetSingleStory: (fastify) => {
        fastify.get('/api/story', async (request, reply) => {
            reply.type('application/json');

            await getSingleStoryRepository(request.query.id).then(async (stories) => {
                reply.code(HTTP_STATUS_CODE_OK).send(stories);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerSaveStory: (fastify) => {
        fastify.post('/api/story', async (request, reply) => {
            reply.type('application/json');

            await saveStoryRepository(request.body).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerRemoveStory: (fastify) => {
        fastify.delete('/api/story', async (request, reply) => {
            reply.type('application/json');

            await removeStoryRepository(request.query.id).then(async () => {
                reply.code(HTTP_STATUS_CODE_OK).send({});
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerGetTranslations: (fastify) => {
        fastify.get('/api/translations', async (request, reply) => {
            reply.type('application/json');

            const { locale } = request.query;

            await getTranslationsRepository(locale).then(async (translations) => {
                reply.code(HTTP_STATUS_CODE_OK).send(translations);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    },
    registerSaveTranslations: (fastify) => {
        fastify.post('/api/translations', async (request, reply) => {
            reply.type('application/json');

            const { locale, secret, translations } = request.body;
            if (secret !== constants.TRANSLATIONS_SECRET) {
                replyWithInternalError(reply, 'Uh uh uh! Wrong secret!');
                return;
            }

            await saveTranslationsRepository(locale, translations).then(async (response) => {
                reply.code(HTTP_STATUS_CODE_OK).send(response);
            }).catch((error) => replyWithInternalError(reply, error));
        });
    }
});
