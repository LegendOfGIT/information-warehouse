module.exports = (item) => {
    const filterInformation = {};

    let bitOfInformation = item.color || '';
    const replacements = {
        anthrazit: 'gray',
        berry: 'purple',
        blau: 'blue', braun: 'brown',
        dunkelblau: 'darkblue',
        gelb: 'yellow', gold: 'gold', grau: 'gray', grün: 'green',
        khaki: 'green',
        mint: 'green',
        navy: 'darkblue',
        rosa: 'pink', rot: 'red',
        schwarz: 'black', silber: 'silver',
        weiß: 'white'
    };

    const t = bitOfInformation.trim().toLowerCase();
    const replacementKey = Object.keys(replacements).find(key => -1 !== t.indexOf(key));
    bitOfInformation = replacementKey ? replacements[replacementKey] : t;
    if (bitOfInformation) {
        filterInformation.color = bitOfInformation;
    }

    return filterInformation;
};