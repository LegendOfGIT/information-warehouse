const queryInformationRepository = require('./queryInformationRepository');
const storeInformationRepository = require('./storeInformationRepository');
const tagsResolver = require('../resolver/tagsResolver');

const getFirstHashtag = (hashtags) => {
    if (!hashtags) {
        return;
    }

    return hashtags.split(',')[0] || '';
}

const modifyScoringValue = (itemToScoreArguments, itemToScore, itemToCompare) => {
    const tags = itemToScore.tags || [];
    const matchingTags = (itemToCompare.tags || []).filter(tag => -1 !== tags.indexOf(tag));

    let hashtag = getFirstHashtag(itemToScoreArguments.hashtags) || itemToScoreArguments.searchProfileId || '';

    hashtag = '' === hashtag ? 'Highlights': hashtag;
    const matchingTagsInPercent = Math.ceil((matchingTags.length * 100) / tags.length);
    const scoring = itemToCompare.scoring || {};
    scoring[hashtag] = scoring[itemToScoreArguments.searchProfileId] || 0;

    scoring[hashtag] = matchingTagsInPercent > 60
        ? scoring[hashtag] + (matchingTagsInPercent * itemToScoreArguments.scoring)
        : scoring[hashtag] - (((100 - matchingTagsInPercent) * (itemToScoreArguments.scoring < 0 ? itemToScoreArguments.scoring * -1 : itemToScoreArguments.scoring)) * 2);

    scoring[hashtag] = scoring[hashtag] > 10000 ? 10000 : scoring[hashtag] < 0 ? 0 : scoring[hashtag];

    itemToCompare.scoring = scoring;
}

module.exports = (informationItemScoring) => new Promise(async (resolve, reject) => {
    if (!informationItemScoring?.itemId) {
        console.log('required itemId is missing');
        reject();
        return;
    }

    if (!informationItemScoring?.scoring) {
        console.log('required scoring is missing');
        reject();
        return;
    }

    const itemsToScore = await queryInformationRepository({
        query: {itemId: informationItemScoring.itemId},
        randomItems: 'false',
        numberOfResults: 1,
        page: 1
    });

    const itemToScore = itemsToScore && itemsToScore.length ? itemsToScore[0] : undefined;
    if (!itemToScore) {
        console.log('item to score can not be found');
        reject();
        return;
    }

    itemToScore.tags = tagsResolver(itemToScore);
    if (!(itemToScore.tags || []).length) {
        console.log('item to score has no tags for scoring');
        reject();
        return;
    }

    modifyScoringValue(informationItemScoring, itemToScore, itemToScore);
    await storeInformationRepository(itemToScore);

    const deepestNavigationId = itemToScore.navigationPath[itemToScore.navigationPath.length - 1];
    const query = {
        itemId: { $ne: informationItemScoring.itemId },
        navigationPath: deepestNavigationId,
        tags: { $exists: true }
    };

    if (informationItemScoring.searchPattern) {
        query.title = informationItemScoring.searchPattern;
    }

    const furtherItemsToScore = await queryInformationRepository({
        query,
        filterIds: (informationItemScoring.filters || '').split('-'),
        randomItems: 'true',
        numberOfResults: 20,
        page: 1
    });

    for (let item of furtherItemsToScore) {
        item.tags = tagsResolver(item);
        modifyScoringValue(informationItemScoring, itemToScore, item);
        await storeInformationRepository(item);
    }

    resolve();
});
