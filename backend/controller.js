const database = require('./database');
const parser = require('./parser');

function getDateRange() {
    const query = `
        SELECT TO_CHAR(MIN(date), 'YYYY-MM-DD') AS min_date,
               TO_CHAR(MAX(date), 'YYYY-MM-DD') AS max_date
        FROM funnel
    `;
    return database.executeQuery(query).then(
        result => result.rows[0]);
}

function getData(start_date, end_date, size, page, sort, filters) {
    const sqlStartDate = parser.getSqlDate(start_date);
    const sqlEndDate = parser.getSqlDate(end_date);
    const sqlFilter = parser.getSqlFilter(filters);
    const sqlSort = parser.getSqlSorter(sort);
    const sqlLimit = parser.getSqlLimit(size, page);

    const query = `
        WITH current AS (
            SELECT
                category,
                product_name,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                SUM(add_to_cart) AS add_to_cart,
                SUM(purchases) AS purchases
            FROM funnel
            WHERE date >= ${sqlStartDate} AND date <= ${sqlEndDate}
            ${sqlFilter}
            GROUP BY category, product_name
        ),
        compare AS (
            SELECT
                category,
                product_name,
                SUM(impressions) AS impressions,
                SUM(clicks) AS clicks,
                SUM(add_to_cart) AS add_to_cart,
                SUM(purchases) AS purchases
            FROM funnel
            WHERE date >= ${sqlStartDate} - (${sqlEndDate} - ${sqlStartDate} + 1) AND date < ${sqlStartDate}
            ${sqlFilter}
            GROUP BY category, product_name
        )
        SELECT
            current.category,
            current.product_name,
            current.impressions,
            (current.impressions - compare.impressions)::decimal / NULLIF(compare.impressions, 0) AS impressions_change,
            current.clicks,
            (current.clicks - compare.clicks)::decimal / NULLIF(compare.clicks, 0) AS clicks_change,
            current.add_to_cart,
            (current.add_to_cart - compare.add_to_cart)::decimal / NULLIF(compare.add_to_cart, 0) AS add_to_cart_change,
            current.purchases AS purchases,
            (current.purchases - compare.purchases)::decimal /  NULLIF(compare.purchases, 0) AS purchases_change
        FROM current
        LEFT JOIN compare USING (category, product_name)
        ${sqlSort}
        ${sqlLimit}
    `;

    // Determine the total number of records
    const countQuery = `
        SELECT COUNT(DISTINCT product_name) AS count
        FROM funnel
        WHERE date >= ${sqlStartDate} AND date <= ${sqlEndDate}
        ${sqlFilter}
    `;
    return Promise.all([
        database.executeQuery(query),
        database.executeQuery(countQuery)
    ]).then(([result, countResult]) => ({
        data: result.rows,
        totalCount: countResult.rows[0].count
    }));
}

module.exports = {
    getData,
    getDateRange
}
