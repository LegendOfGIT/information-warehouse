const CATEGORY_MAPPING = {
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_FRIDGES_AND_FREEZERS: 'fridges-and-freezers',
    FASHION_WOMEN_JEWELRY: 'women-jewelry',
    FASHION_MEN_JEWELRY: 'men-jewelry',
    MULTIMEDIA_GAMES: 'multimedia-games',
    MULTIMEDIA_GAMES_NINTENDO_SWITCH: 'nintendo-switch-games',
    MULTIMEDIA_GAMES_PC: 'pc-games'
};

module.exports = {
    getCategoryIdByNavigationId: (navigationId) => {
        return CATEGORY_MAPPING[navigationId] || '';
    },
    getRandomCategoryId: () => {
        return Object.values(CATEGORY_MAPPING)[Math.floor(Math.random() * Object.values(CATEGORY_MAPPING).length)];
    }
};