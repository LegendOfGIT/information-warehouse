module.exports = (informationItem) => {
    informationItem = informationItem || {};

    if (!informationItem.itemId) {
        console.log('required itemId is missing');
    }
};
