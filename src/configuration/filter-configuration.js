const FILTER_MAPPING = {
    1000000: { property: 'providers.itemId', value: 'dress-for-less' },
    1000001: { property: 'providers.itemId', value: 'biggreensmile' },
    1000018: { property: 'providers.itemId', value: '100percentpure' },
    1000019: { property: 'providers.itemId', value: 'amazon' },
    1000020: { property: 'providers.itemId', value: 'backmarket' },
    1000021: { property: 'providers.itemId', value: 'bear-family' },
    1000022: { property: 'providers.itemId', value: 'bisbshop' },
    1000023: { property: 'providers.itemId', value: 'buch24' },
    1000024: { property: 'providers.itemId', value: 'ebrosia' },
    1000025: { property: 'providers.itemId', value: 'enners' },
    1000026: { property: 'providers.itemId', value: 'fussmatten-welt' },
    1000027: { property: 'providers.itemId', value: 'haymancoffee' },
    1000028: { property: 'providers.itemId', value: 'hoerner-group' },
    1000029: { property: 'providers.itemId', value: 'idee-shop' },
    1000030: { property: 'providers.itemId', value: 'inhofer' },
    1000031: { property: 'providers.itemId', value: 'iwmhchair' },
    1000032: { property: 'providers.itemId', value: 'janvanderstorm' },
    1000033: { property: 'providers.itemId', value: 'mytoys' },
    1000034: { property: 'providers.itemId', value: 'naturalfoodshop' },
    1000035: { property: 'providers.itemId', value: 'otto' },
    1000036: { property: 'providers.itemId', value: 'pakama' },
    1000037: { property: 'providers.itemId', value: 'plantlife' },
    1000038: { property: 'providers.itemId', value: 'quelle' },
    1000039: { property: 'providers.itemId', value: 'reifen' },
    1000040: { property: 'providers.itemId', value: 'sandawha-skincare' },
    1000041: { property: 'providers.itemId', value: 'shop24direct' },
    1000042: { property: 'providers.itemId', value: 'shop-apotheke' },
    1000043: { property: 'providers.itemId', value: 'songmics' },
    1000044: { property: 'providers.itemId', value: 'studibuch' },
    1000045: { property: 'providers.itemId', value: 'third-of-life' },
    1000046: { property: 'providers.itemId', value: 'timber-taste' },
    1000047: { property: 'providers.itemId', value: 'toom' },
    1000048: { property: 'providers.itemId', value: 'topparfuemerie' },
    1000049: { property: 'providers.itemId', value: 'waschbaer' },
    1000050: { property: 'providers.itemId', value: 'whitecollection' },
    1000052: { property: 'providers.itemId', value: 'messmer' },
    1000063: { property: 'providers.itemId', value: 'flaconi' },

    1000014: { property: 'filterInformation.color', value: 'black' },
    1000008: { property: 'filterInformation.color', value: 'blue' },
    1000009: { property: 'filterInformation.color', value: 'brown' },
    1000006: { property: 'filterInformation.color', value: 'darkblue' },
    1000007: { property: 'filterInformation.color', value: 'darkred' },
    1000011: { property: 'filterInformation.color', value: 'gold' },
    1000005: { property: 'filterInformation.color', value: 'gray' },
    1000012: { property: 'filterInformation.color', value: 'green' },
    1000013: { property: 'filterInformation.color', value: 'pink' },
    1000017: { property: 'filterInformation.color', value: 'purple' },
    1000015: { property: 'filterInformation.color', value: 'silver' },
    1000004: { property: 'filterInformation.color', value: 'red' },
    1000016: { property: 'filterInformation.color', value: 'white' },
    1000010: { property: 'filterInformation.color', value: 'yellow' },

    1000002: { property: 'fit', value: 'flare fit' },
    1000003: { property: 'fit', value: 'skinny fit' },

    1000081: { property: 'storageSize', value: '16 GB' },
    1000082: { property: 'storageSize', value: '32 GB' },
    1000083: { property: 'storageSize', value: '64 GB' },
    1000084: { property: 'storageSize', value: '128 GB' },
    1000085: { property: 'storageSize', value: '256 GB' },
    1000086: { property: 'storageSize', value: '512 GB' },

    1000088: { property: 'brand', value: 'adidas' },
    1000087: { property: 'brand', value: 'apple' },
    1000098: { property: 'brand', value: 'banani' },
    1000101: { property: 'brand', value: 'bugatti' },
    1000103: { property: 'brand', value: 'calvin klein' },
    1000099: { property: 'brand', value: 'desigual' },
    1000105: { property: 'brand', value: 'esprit' },
    1000102: { property: 'brand', value: 'fossil' },
    1000100: { property: 'brand', value: 'gabor' },
    1000091: { property: 'brand', value: 'google' },
    1000096: { property: 'brand', value: 'guess' },
    1000097: { property: 'brand', value: 'lascara' },
    1000093: { property: 'brand', value: 'lego' },
    1000104: { property: 'brand', value: 'nike' },
    1000095: { property: 'brand', value: 'nintendo' },
    1000090: { property: 'brand', value: 'puma' },
    1000089: { property: 'brand', value: 'samsung' },
    1000092: { property: 'brand', value: 'sony' },
    1000094: { property: 'brand', value: 'vivanco' },

    1000051: { property: 'navigationPath', value: '_tea' },
    1000053: { property: 'navigationPath', value: '_soap' },
    1000054: { property: 'navigationPath', value: '_fragrances_men' },
    1000055: { property: 'navigationPath', value: '_fragrances_women' },
    1000056: { property: 'navigationPath', value: '_hair_care' },
    1000057: { property: 'navigationPath', value: '_hair_styling' },
    1000058: { property: 'navigationPath', value: '_painkillers' },
    1000059: { property: 'navigationPath', value: '_makeup_eyes' },
    1000060: { property: 'navigationPath', value: '_makeup_lips' },
    1000061: { property: 'navigationPath', value: '_face_care' },
    1000062: { property: 'navigationPath', value: '_skin_care_kids' },
    1000064: { property: 'navigationPath', value: '_cables_audiocables' },
    1000065: { property: 'navigationPath', value: '_cables_displaycables' },
    1000066: { property: 'navigationPath', value: '_cables_electriccables' },
    1000067: { property: 'navigationPath', value: '_cables_networkcables' },
    1000068: { property: 'navigationPath', value: '_computers_tablets' },
    1000069: { property: 'navigationPath', value: '_FULLYAUTOMATICCOFFEEMACHINES' },
    1000070: { property: 'navigationPath', value: '_homecinema' },
    1000071: { property: 'navigationPath', value: '_inkjetprinter' },
    1000072: { property: 'navigationPath', value: '_laserprinter' },
    1000073: { property: 'navigationPath', value: '_home_tvs' },
    1000074: { property: 'navigationPath', value: '_dishwashers' },
    1000075: { property: 'navigationPath', value: '_dryers' },
    1000076: { property: 'navigationPath', value: '_FRIDGES_AND_FREEZERS' },
    1000077: { property: 'navigationPath', value: '_ovens' },
    1000078: { property: 'navigationPath', value: '_washing_machines' },
    1000079: { property: 'navigationPath', value: '_SMARTPHONESCELLPHONES' },
    1000080: { property: 'navigationPath', value: '_smartwatches' }
};

const NAVIGATION_DEFAULT_FILTERS = {
    FASHION: [1000105, 1000103, 1000101, 1000102, 1000090, 1000104, 1000088]
};

module.exports = {
    getDefaultFilterIdsBy(givenFilterIds, navigationId, numberOfResults, randomItems) {
        if ((givenFilterIds || []).length > 0) {
            return givenFilterIds;
        }

        if (!randomItems && !numberOfResults) {
            return [];
        }

        return NAVIGATION_DEFAULT_FILTERS[navigationId] || [];
    },
    getFilterPropertiesByFilterIds: (filterIds) => {
        const filterProperties = {};

        (filterIds || []).forEach(filterId => {
            const filterFromMapping = FILTER_MAPPING[filterId];
            if (!filterFromMapping) {
                return;
            }

            const propertyFilters = filterProperties[filterFromMapping.property] || [];
            propertyFilters.push(filterFromMapping);
            filterProperties[filterFromMapping.property] = propertyFilters;
        });

        return filterProperties;
    }
};