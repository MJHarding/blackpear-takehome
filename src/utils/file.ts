import fs from 'fs';
import path from 'path';

/**
 *
 * @param directoryPath
 * @returns combined json data for given directory
 */
export function loadJsonFiles<T>(directoryPath: string): T[] {
  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.json'));
  let allData: T[] = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData: T = JSON.parse(rawData);
    allData.push(jsonData);
  });

  return allData;
}
