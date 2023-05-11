module.exports = (givenValue) => {
    const valueToCheck = (givenValue || '').replace(/[^a-zA-Z0-9!?]/g,'').toLowerCase();
    const badTerms = [ 'hitler' ];

    return !!badTerms.find(badTerm => -1 !== valueToCheck.indexOf(badTerm));
};