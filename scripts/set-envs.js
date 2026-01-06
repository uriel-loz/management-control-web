const dotenv = require('dotenv')
const { writeFileSync, mkdirSync } = require('fs')

dotenv.config();

const targetPath = './src/environments/environments.ts';

const envContent = `export const environment = {
  baseUrl: '${process.env.BASE_URL}',
};`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envContent);