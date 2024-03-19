const PG = require("pg");

const pool = new PG.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    port: '5432',
    database: 'postgres',
});

async function executeQuery(query) {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    return result;
}

module.exports = {
    executeQuery
}