const validSortDirections = ['asc', 'desc'];
const validFieldNameExp = RegExp(/^[a-zA-Z0-9_]+$/);
const validFilterTypes = ['=', '>', '<', '>=', '<=', '!=', 'like'];
const validFilterValueExp = RegExp(/^[a-zA-Z0-9 ]+$/)
const validDateExp = RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);

function parseDate(date) {
    if (!date || !validDateExp.test(date)) throw new Error('Invalid date');
    return `DATE('${date}')`;
}

function parseSorter(sort) {
    if (Array.isArray(sort) && sort.length > 0) {
        return 'ORDER BY ' + sort.map(({field, dir}) => {
            if (!validFieldNameExp.test(field)) throw new Error('Invalid field name');
            if (!validSortDirections.includes(dir)) throw new Error('Invalid sort direction');
            return `${field} ${dir} NULLS LAST`
        }).join(', ');
    } else {
        return '';
    }
}

function parseLimit(size, page) {
    if (!size || !page) {
        return '';
    }
    return `LIMIT ${size} OFFSET ${(page - 1) * size}`;
}

function parseFilter(filters) {
    if (!filters) {
        return '';
    }
    return filters.map(({field, type, value}) => {
        if (!validFieldNameExp.test(field)) throw new Error('Invalid field name');
        if (!validFilterTypes.includes(type)) throw new Error('Invalid filter type');
        if (!validFilterValueExp.test(value)) throw new Error('Invalid filter value');
        return `AND ${field} ${type} '%${value}%'`
    }).join('');
}

module.exports = {
    getSqlDate: parseDate,
    getSqlSorter: parseSorter,
    getSqlLimit: parseLimit,
    getSqlFilter: parseFilter
}