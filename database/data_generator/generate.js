import { faker } from '@faker-js/faker';
import fs from 'fs/promises';

const start_date = new Date("2024-01-01");
const end_date = new Date("2024-02-29");
const categories = Array.from({length: 10}, () => faker.commerce.department());
const sellers = Array.from({length: 25}, () => faker.company.name());
const products = Array.from({length: 2000}, () => faker.commerce.productName());
const numRecordsPerDay = 100;

// Function to generate dummy data
function generateDummyData() {
  const data = [];

  for (let date = start_date; date <= end_date; date.setDate(date.getDate() + 1)) {
    for (let i = 0; i < numRecordsPerDay; i++) {
      const record = {
        date: date.toISOString().slice(0, 10),
        category: faker.helpers.arrayElement(categories),
        seller: faker.helpers.arrayElement(sellers),
        product_name: faker.helpers.arrayElement(products),
        impressions: faker.number.int(10000),
        clicks: faker.number.int(1000),
        add_to_cart: faker.number.int(250),
        purchases: faker.number.int(200),
      };
      data.push(record);
    }
  }
  return data;
}

// Function to convert data to CSV format
function convertToCSV(data) {
  const header = Object.keys(data[0]).join(';');
  const rows = data.map((record) => Object.values(record).join(';'));

  return `${header}\n${rows.join('\n')}`;
}

// Function to write data to CSV file
async function writeDataToCSV(data, filename) {
  const csvData = convertToCSV(data);

  await fs.writeFile(filename, csvData, 'utf-8');
  console.log(`Dummy data has been generated and saved to ${filename}`);
}

// Generate dummy data
const dummyData = generateDummyData();

// Specify the filename for the CSV file
const csvFilename = 'dummy_data.csv';

// Write data to CSV file
await writeDataToCSV(dummyData, csvFilename);
