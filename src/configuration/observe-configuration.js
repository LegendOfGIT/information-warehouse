module.exports = {
    getCategoryIdByNavigationId: (navigationId) => {
        const mapping = {
            ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_FRIDGES_AND_FREEZERS: 'fridges-and-freezers',
            FASHION_WOMEN_JEWELRY: 'women-jewelry',
            MULTIMEDIA_GAMES: 'multimedia-games',
            MULTIMEDIA_GAMES_NINTENDO_SWITCH: 'nintendo-switch-games',
            MULTIMEDIA_GAMES_PC: 'pc-games'
        };

        return mapping[navigationId] || '';
    }
};