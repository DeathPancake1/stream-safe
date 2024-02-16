const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

async function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return hash;
}

async function xorHashes(hashes) {
  if (hashes.length === 0) {
    return '';
  }

  let result = BigInt(`0x${hashes[0]}`);
  for(let i = 1; i < hashes.length; i++){
    result ^= BigInt(`0x${hashes[i]}`);
  }
  
  return result.toString(16);
}

async function readAndHashFiles(directoryPath, scriptFilename) {
  const hashes = [];

  async function traverseDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    const promises = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (path.basename(filePath) !== 'node_modules') {
          promises.push(traverseDirectory(filePath)); // Recursive call for nested directories
        }
      } else {
        if (filePath !== scriptFilename) {
          promises.push(
            hashFile(filePath).then(hash => {
              hashes.push(hash);
            })
          );
        }
      }
    }

    await Promise.all(promises);
  }

  await traverseDirectory(directoryPath);
  return hashes;
}

async function sendXORHashAndRandomNumberToAPI(xorHash, randomNumber, apiKey) {
  const apiUrl = 'http://localhost:3000/';

  try {
    const response = await axios.post(apiUrl, { xorHash, randomNumber, apiKey });
    return response.data;
  } catch (error) {
    console.error('Error sending XOR hash and random number to API:', error.message);
    return error.message;
  }
}

async function main(apiKey) {
  const directoryPath = './app'; // Change this to the desired directory path
  const scriptFilename = path.basename(__filename);
  const hashes = await readAndHashFiles(directoryPath, scriptFilename);
  const xorHash = await xorHashes(hashes);

  // Generate a random number and hash it
  const randomNumber = crypto.randomBytes(16).toString('hex');
  const randomHash = crypto.createHash('sha256').update(randomNumber).digest('hex');

  // XOR the random hash with the overall hash
  const finalXorHash = await xorHashes([xorHash, randomHash]);

  return await sendXORHashAndRandomNumberToAPI(finalXorHash, randomNumber, apiKey);
}

exports.main = main;
