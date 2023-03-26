const CATEGORY_MAPPING = {
    BEAUTY_CARE_SKIN_CARE_FACE_CARE: 'face-care',
    BEAUTY_CARE_SKIN_CARE_KIDS: 'skin-care-kids',
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_FRIDGES_AND_FREEZERS: 'fridges|freezers',
    COSMETICS_HAIR_STYLING: 'hairstyling',
    COSMETICS_MAKEUP_EYES: 'makeup-eyes',
    COSMETICS_WOMEN_FRAGRANCES: 'women-fragrances',
    FASHION_WOMEN_BAGS: 'women-bags',
    FASHION_WOMEN_JEANS: 'women-jeans',
    FASHION_WOMEN_JEWELRY: 'women-jewelry',
    FASHION_WOMEN_PANTS: 'women-pants',
    FASHION_WOMEN_SHOES: 'women-shoes',
    FASHION_WOMEN_SWEATERS_AND_KNITWEAR: 'women-sweaters-knitwear',
    FASHION_MEN_JEANS: 'men-jeans',
    FASHION_MEN_JEWELRY: 'men-jewelry',
    FASHION_MEN_PANTS: 'men-pants',
    FASHION_MEN_SHOES: 'men-shoes',
    FASHION_MEN_SWEATERS_AND_KNITWEAR: 'men-sweaters-knitwear',
    HOME_ACCESSOIRES_CARPETS: 'carpets',
    KIDS_PARTY_TABLEWARE: 'kids-party-tableware',
    KIDS_SCHOOL_SATCHEL: 'kids-school-satchel',
    KIDS_TOYS_BABIES: 'kids-baby-toys',
    KIDS_TOYS_ELECTRICVEHICLES: 'kids-electric-vehicles',
    KIDS_TOYS_SCOOTERS: 'kids-scooters',
    LIGHTING_INNERLIGHTING_CEILING: 'lighting-ceiling',
    MULTIMEDIA_GAMES_NINTENDO_SWITCH: 'nintendo-switch-games',
    MULTIMEDIA_GAMES_PC: 'pc-games',
    MULTIMEDIA_GAMES_PLAYSTATION_4: 'playstation-4-games',
    MULTIMEDIA_GAMES_PLAYSTATION_5: 'playstation-5-games',
    MUSIC_CD_ALTERNATIVE: 'music-alternative',
    MUSIC_CD_GERMANFOLK: 'german-folk-music',
    MUSIC_CD_POP: 'music-pop',
    MUSIC_CD_ROCK: 'music-rock'
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