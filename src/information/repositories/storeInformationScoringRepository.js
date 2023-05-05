const queryInformationRepository = require('./queryInformationRepository');
const storeInformationRepository = require('./storeInformationRepository');

const getFirstHashTag = (hashTags) => {
    if (!hashTags) {
        return;
    }

    return hashTags.split(',')[0] || '';
}

const increaseScoringValue = (itemToScoreArguments, itemToScore, itemToCompare) => {
    const tags = itemToScore.tags || [];
    const matchingTags = (itemToCompare.tags || []).filter(tag => -1 !== tags.indexOf(tag));

    let hashtag = getFirstHashTag(itemToScoreArguments.hashTags) || itemToScoreArguments.searchProfileId || '';

    hashtag = '' === hashtag ? 'WeWannaShop': hashtag;
    const matchingTagsInPercent = Math.ceil((matchingTags.length * 100) / tags.length);
    const scoring = itemToCompare.scoring || {};
    scoring[hashtag] = scoring[itemToScoreArguments.searchProfileId] || 0;
    scoring[hashtag] += (matchingTagsInPercent * itemToScoreArguments.scoring);
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

    const itemsToScore = await queryInformationRepository({itemId: informationItemScoring.itemId}, false, 1, 1);
    const itemToScore = itemsToScore && itemsToScore.length ? itemsToScore[0] : undefined;
    if (!itemToScore) {
        console.log('item to score can not be found');
        reject();
        return;
    }

    if (!(itemToScore.tags || []).length) {
        console.log('item to score has no tags for scoring');
        reject();
        return;
    }

    increaseScoringValue(informationItemScoring, itemToScore, itemToScore);
    await storeInformationRepository(itemToScore);

    const deepestNavigationId = itemToScore.navigationPath[itemToScore.navigationPath.length - 1];
    const furtherItemsToScore = await queryInformationRepository(
        {
            itemId: { $ne: informationItemScoring.itemId },
            navigationPath: deepestNavigationId,
            tags: { $exists: true }
        },
        true,
        20,
        1);

    for (let item of furtherItemsToScore) {
        increaseScoringValue(informationItemScoring, itemToScore, item);
        await storeInformationRepository(item);
    }

    resolve();
});
