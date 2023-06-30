module.exports = (item) => {
    const filterInformation = {};

    let bitOfInformation = item.color || '';
    const replacements = {
        dunkelblau: 'darkblue', dunkelrot: 'darkred',

        anthrazit: 'gray',
        blau: 'blue', braun: 'brown',
        gelb: 'yellow', gold: 'gold', grau: 'gray', grün: 'green',
        khaki: 'green',
        rosa: 'pink', rot: 'red',
        schwarz: 'black', silber: 'silver',
        weiß: 'white',

        darkblue: 'darkblue',
        darkred: 'darkred',

        berry: 'purple', black: 'black', blue: 'blue', brown: 'brown',
        gray: 'gray', green: 'green', grey: 'gray',
        mint: 'green',
        navy: 'darkblue',
        pink: 'pink', purple: 'purple',
        red: 'red',
        silver: 'silver',
        white: 'white',
        yellow: 'yellow'
    };

    const t = bitOfInformation.trim().toLowerCase();
    const replacementKey = Object.keys(replacements).find(key => -1 !== t.indexOf(key));
    if (bitOfInformation && replacementKey) {
        filterInformation.color = replacements[replacementKey];
    }

    return filterInformation;
};