const CATEGORY_MAPPING = {
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_FRIDGES_AND_FREEZERS: 'fridges|freezers',
    FASHION_WOMEN_JEWELRY: 'women-jewelry',
    FASHION_MEN_JEWELRY: 'men-jewelry',
    MULTIMEDIA_GAMES_NINTENDO_SWITCH: 'nintendo-switch-games',
    MULTIMEDIA_GAMES_PC: 'pc-games',
    MULTIMEDIA_GAMES_PLAYSTATION_4: 'playstation-4-games',
    MULTIMEDIA_GAMES_PLAYSTATION_5: 'playstation-5-games',
    MUSIC_CD_GERMANFOLK: 'german-folk-music'
};

module.exports = {
    getCategoryIdsByNavigationId: (navigationId) => {
        return (CATEGORY_MAPPING[navigationId] || '').split('|');
    },
    getRandomCategoryIds: () => {
        return Object.values(CATEGORY_MAPPING)[Math.floor(Math.random() * Object.values(CATEGORY_MAPPING).length)]
            .split('|');
    }
};