module.exports = (givenValue) => {
    const valueToCheck = (givenValue || '').replace(/[^a-zA-Z0-9!?üäß%$,]/g,'').toLowerCase();
    const badTerms = [
        'aasgeier', 'abschaum', 'armleuchter', 'arsch', 'ätzend', 'aufgeilen',
        'backpfeife', 'bastard', 'beschiss', 'beschiß', 'blöd', 'blutig', 'bratze', 'bulle', 'bumsen', 'bumslokal',
        'drecksack', 'drecksau', 'dreckskerl', 'dumm',
        'fettbacke', 'fick', 'fotze', 'furz',
        'geiler', 'geiles', 'geschiss', 'gesöff', 'gewalt', 'giftzwerg', 'goebbels', 'goering', 'göbbels', 'göring',
        'heydrich', 'himmler', 'hirnlos', 'hirnrissig', 'hitler', 'homo', 'huhre', 'hure',
        'idiot',
        'kack', 'kotz',
        'leckmich', 'luder', 'lusche',
        'masturbi', 'mengele', 'missgeburt', 'miststück', 'möpse', 'muschi',
        'nutte', 'nazi',
        'onani',
        'penner', 'pestbeule', 'pisse', 'pissnelke', 'pisst',
        'reihern',
        'sack', 'scheiß', 'scheiss', 'schlampe', 'schwanz', 'schweinehund', 'schweinepriester', 'schwuchtel', 'schwul', 'stinker', 'stinkstiefel', 'stricher',
        'trottel', 'titte',
        'verdammt', 'verhurt', 'verpiss',
        'weichei', 'wertlos', 'wichser'
    ];

    return !!badTerms.find(badTerm => -1 !== valueToCheck.indexOf(badTerm));
};