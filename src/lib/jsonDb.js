import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data');

export async function readJson(filename) {
    try {
        const filePath = path.join(DATA_PATH, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

export async function writeJson(filename, data) {
    try {
        const filePath = path.join(DATA_PATH, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}
