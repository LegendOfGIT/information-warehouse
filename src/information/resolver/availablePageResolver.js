
module.exports = (resultCount, itemsPerPage, current) => {
    const total = Math.ceil(resultCount / itemsPerPage);
    current = current < 2 ? 2 : current > total ? total : current;

    const center = [current - 1, current, current + 1],
        filteredCenter = center.filter((p) => p > 1 && p < total),
        includeThreeLeft = current === 4,
        includeThreeRight = current === total - 3,
        includeLeftDots = current > 4,
        includeRightDots = current < total - 3;

    if (includeThreeLeft) filteredCenter.unshift(2)
    if (includeThreeRight) filteredCenter.push(total - 1)

    if (includeLeftDots) filteredCenter.unshift(0);
    if (includeRightDots) filteredCenter.push(0);

    return [1, ...filteredCenter, total].filter((value, index, array) => !value || array.indexOf(value) === index);
};