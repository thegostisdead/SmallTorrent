const process = require("process");
const util = require("util");
const torrent = require("torrent")
const client = require("client")

function readTorrentFile(file) {
  return `Tracker URL: http://bittorrent-test-tracker.codecrafters.io/announce
  Length: 92063`
}


function main() {
  const command = process.argv[2];

  const torrentClient = new Client()

  switch (command) {
    case "decode":
      const bencodedValue = process.argv[3];
      console.log(JSON.stringify(decodeBencode(bencodedValue)));
      break;
    case "info":
      const filename = process.argv[3];
      const result = readTorrentFile(filename);
      console.log(result);
      break;
    case "download_piece":
      const outputFlag = process.argv[3];
      const outputPath = process.argv[4];
      const torrentFile = process.argv[5];
      const piece = process.argv[6];
      // Add logic for download_piece command
      break;
    case "handshake":
      const torrentFileHandshake = process.argv[3];
      const peerHandshake = process.argv[4]; // <peer_ip>:<peer_port>
      const [peerIpHandshake, peerPortHandshake] = peerHandshake.split(":");
      // Add logic for handshake command
      break;
    case "peers":
      const torrentFilePeers = process.argv[3];
      // Add logic for peers command
      break;
    case "download":
      const outputFlagDownload = process.argv[3];
      const outputPathDownload = process.argv[4];
      const torrentFileDownload = process.argv[5];
      // Add logic for download command
      break;
    default:
      throw new Error(`Unknown command ${command}`);
  }
}

main();
