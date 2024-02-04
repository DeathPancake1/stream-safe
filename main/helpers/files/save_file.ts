import path from "path";
import fs from 'fs';

export default async function writeFile (event, user1Email, user2Email, fileName, data)  {
    const outputFilePath = path.join('videos',user1Email + '_' + user2Email);
    fs.mkdir(outputFilePath, { recursive: true }, (err) => {
        if (err) throw err;
      
        const fullPath = path.join(outputFilePath, fileName);
      
        // Write data to the file
        fs.writeFileSync(fullPath, data, 'base64')
    });
    return true
}