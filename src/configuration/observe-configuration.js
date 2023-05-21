const CATEGORY_MAPPING = {
    BEAUTY_CARE_SKIN_CARE_FACE_CARE: 'face-care',
    BEAUTY_CARE_SKIN_CARE_KIDS: 'skin-care-kids',
    ELECTRONICS_AND_COMPUTERS_CABLES_AUDIOCABLES: 'audio-cables',
    ELECTRONICS_AND_COMPUTERS_CABLES_DISPLAYCABLES: 'hdmi-cables',
    ELECTRONICS_AND_COMPUTERS_CABLES_ELECTRICCABLES: 'electric-cables',
    ELECTRONICS_AND_COMPUTERS_CABLES_NETWORKCABLES: 'network-cables|fibre-optic-cables',
    ELECTRONICS_AND_COMPUTERS_COMPUTERS_TABLETS: 'tablets',
    ELECTRONICS_AND_COMPUTERS_HOME_FULLYAUTOMATICCOFFEEMACHINES: 'fully-automatic-coffee-machines',
    ELECTRONICS_AND_COMPUTERS_HOME_INKJETPRINTER: 'inkjet-printer',
    ELECTRONICS_AND_COMPUTERS_HOME_LASERPRINTER: 'laser-printer',
    ELECTRONICS_AND_COMPUTERS_HOME_TVS: 'tvs',
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_DISHWASHERS: 'dishwashers',
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_DRYERS: 'dryers',
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_FRIDGES_AND_FREEZERS: 'fridges|freezers',
    ELECTRONICS_AND_COMPUTERS_LARGE_APPLIANCES_WASHING_MACHINES: 'washing-machines',
    ELECTRONICS_AND_COMPUTERS_PHONES_SMARTPHONESCELLPHONES: 'smartphones-cellphones',
    ELECTRONICS_AND_COMPUTERS_WEARABLES_SMARTWATCHES: 'smartwatches',
    COSMETICS_HAIR_CARE: 'hair-care',
    COSMETICS_HAIR_STYLING: 'hairstyling',
    COSMETICS_MAKEUP_EYES: 'makeup-eyes',
    COSMETICS_MAKEUP_LIPS: 'makeup-lips',
    COSMETICS_MEN_FRAGRANCES: 'men-fragrances',
    COSMETICS_WOMEN_FRAGRANCES: 'women-fragrances',
    FASHION_BOYS_SHOES: 'boys-shoes',
    FASHION_GIRLS_SHOES: 'girls-shoes',
    FASHION_MEN_JACKETS: 'men-jackets',
    FASHION_MEN_JEANS: 'men-jeans',
    FASHION_MEN_JEWELRY: 'men-jewelry',
    FASHION_MEN_NIGHTWEAR: 'men-nightwear',
    FASHION_MEN_PANTS: 'men-pants',
    FASHION_MEN_SHOES: 'men-shoes',
    FASHION_MEN_SWEATERS_AND_KNITWEAR: 'men-sweaters-knitwear',
    FASHION_WOMEN_BAGS: 'women-bags',
    FASHION_WOMEN_JACKETS: 'women-jackets',
    FASHION_WOMEN_JEANS: 'women-jeans',
    FASHION_WOMEN_JEWELRY: 'women-jewelry|women-necklaces|women-earrings|women-rings',
    FASHION_WOMEN_NIGHTWEAR: 'women-nightwear',
    FASHION_WOMEN_PANTS: 'women-pants',
    FASHION_WOMEN_SHOES: 'women-shoes',
    FASHION_WOMEN_SWEATERS_AND_KNITWEAR: 'women-sweaters-knitwear',
    GROCERIES_DRINKS_COFFEE: 'coffee',
    GROCERIES_FOOD_DRYFRUITS: 'dry-fruits',
    GROCERIES_FOOD_NUTS: 'nuts',
    GROCERIES_FOOD_SAUCES: 'sauces',
    GROCERIES_FOOD_SPICES: 'spices',
    HOME_ACCESSOIRES_BEDCOVERS: 'bedcovers',
    HOME_ACCESSOIRES_CARPETS: 'carpets',
    HOME_ACCESSOIRES_PILLOWS: 'pillows',
    HOME_COOKINGANDBAKING_BAKINGSUPPLIES: 'baking-supplies',
    HOME_FURNITURE_BEDS: 'beds',
    HOME_FURNITURE_DININGTABLES: 'dining-tables',
    HOME_FURNITURE_GAMINGCHAIRS: 'gaming-chairs',
    HOME_FURNITURE_KIDSBEDS: 'kids-beds',
    HOME_FURNITURE_SOFAS: 'sofas',
    HOME_GARDEN_GRILLS: 'garden-grills',
    HOME_GARDEN_GARDENHOUSES: 'garden-houses',
    HOME_GARDEN_LAWNMOWERS: 'garden-lawnmowers',
    HOME_GARDEN_LOUNGEFURNITURE: 'garden-loungefurniture',
    HOME_GARDEN_SPORTS: 'garden-trampolines|garden-soccergoals',
    HOME_PETS_CATS: 'pets-cats',
    HOME_PETS_DOGS: 'pets-dogs',
    HOME_TOOLS_DRILLINGMACHINES: 'drilling-machines',
    HOME_TOOLS_ELECTRICSAWS: 'electric-saws',
    KIDS_BOOKS_AUDIOBOOKS: 'kids-audio-books',
    KIDS_PARTY_TABLEWARE: 'kids-party-tableware',
    KIDS_SCHOOL_SATCHEL: 'kids-school-satchel',
    KIDS_TOYS_BABIES: 'kids-baby-toys',
    KIDS_TOYS_CONSTRUCTIONTOYS: 'kids-construction-toys',
    KIDS_TOYS_ELECTRICVEHICLES: 'kids-electric-vehicles',
    KIDS_TOYS_EXPERIMENTANDRESEARCH: 'kids-toys-experiment-research',
    KIDS_TOYS_GAMES: 'kids-games',
    KIDS_TOYS_SCOOTERS: 'kids-scooters',
    KIDS_TOYS_TOYVEHICLES: 'kids-toy-vehicles',
    LIGHTING_INNERLIGHTING_ACCESSOIRES: 'lighting-inner-accessoires',
    LIGHTING_INNERLIGHTING_CEILING: 'lighting-ceiling',
    LUXURIES_DRINKS_COFFEE: 'luxuries-coffee',
    LUXURIES_WRITINGSUPPLIES_BIROS: 'luxuries-biros',
    LUXURIES_WRITINGSUPPLIES_FOUNTAINPENS: 'luxuries-fountain-pens',
    MULTIMEDIA_BOOKS_CRIMETHRILLERS: 'books-crime-thrillers',
    MULTIMEDIA_BOOKS_HISTORY: 'books-history',
    MULTIMEDIA_BOOKS_PHILOSOPHY: 'books-philosophy',
    MULTIMEDIA_GAMES_NINTENDO_SWITCH: 'nintendo-switch-games',
    MULTIMEDIA_GAMES_PC: 'pc-games',
    MULTIMEDIA_GAMES_PLAYSTATION_4: 'playstation-4-games',
    MULTIMEDIA_GAMES_PLAYSTATION_5: 'playstation-5-games',
    MULTIMEDIA_MOVIES_ACTION: 'movies-action|movies-bluray-action|movies-dvd-action',
    MULTIMEDIA_MOVIES_FANTASY: 'movies-fantasy|movies-bluray-fantasy|movies-dvd-fantasy',
    MUSIC_CD_ALTERNATIVE: 'music-alternative',
    MUSIC_CD_GERMANFOLK: 'german-folk-music',
    MUSIC_CD_POP: 'music-pop',
    MUSIC_CD_ROCK: 'music-rock',
    SPORTS_EXERCISE_EQUIPMENT: 'sports-exercise-equipment',
    VEHICLES_BICYCLES_CITYBIKES: 'city-bikes',
    VEHICLES_BICYCLES_ELECTRICBIKES: 'electric-bikes',
    VEHICLES_BICYCLES_KIDSBIKES: 'kids-bikes',
    VEHICLES_CARS_ALLWEATHERTYRES: 'car-all-weather-tyres',
    VEHICLES_CARS_CHILDSEATS: 'car-child-seats',
    VEHICLES_CARS_SUMMERTYRES: 'car-summer-tyres',
    VEHICLES_CARS_WINTERTYRES: 'car-winter-tyres'
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