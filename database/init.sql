CREATE TABLE funnel (
    date DATE,
    category VARCHAR(100),
    seller VARCHAR(100),
    product_name VARCHAR(100),
    impressions INT,
    clicks INT,
    add_to_cart INT,
    purchases INT
);

COPY funnel FROM '/tmp/dummy_data.csv' DELIMITER ';' CSV HEADER;
