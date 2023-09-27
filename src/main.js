const process = require("process");
const util = require("util");


function parseNumber(exp) {
  if (exp.length >= 3 && exp.at(0) === "i" && exp.at(-1) === "e") {
    return parseInt(exp.substr(1, exp.length - 2))
  }
}

function parseString(exp) {
  if (!isNaN(bencodedValue[0])) {
    const parts = bencodedValue.split(":");
    const length = parseInt(parts[0], 10);
    return parts[1].substr(0, length);
  }
}

function parseList(exp) {
  if (exp[0] === "l" && exp.at(-1) === "e") {
    const line = exp.substr(1, exp.length - 2)
    return decodeBencode(line)
  } 
}

// Examples:
// - decodeBencode("5:hello") -> "hello"
// - decodeBencode("10:hello12345") -> "hello12345"
// - decodeBencode("i52e") -> 52
// - decodeBencode("l5:helloi52ee") -> [“hello”,52]

function decodeBencode(bencodedValue) {


  parseList(bencodedValue)
  parseNumber(bencodedValue)
  parseString(bencodedValue)

}

function readTorrentFile(file) {
  

  return `Tracker URL: http://bittorrent-test-tracker.codecrafters.io/announce
  Length: 92063`
}



function main() {
  const command = process.argv[2];
  if (command === "decode") {
    const bencodedValue = process.argv[3];
    console.log(JSON.stringify(decodeBencode(bencodedValue)));
  
  } else if (command === "info") {
    const filename = process.argv[3];
    const result = readTorrentFile(filename)
    
    console.log(result)

  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();
