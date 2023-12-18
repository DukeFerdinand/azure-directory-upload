// this script is used to upload a directory to s3 container

import {readdirSync} from "node:fs"
import {cpus} from "node:os"
import {getBlobService} from "./shared.ts";

// get arguments from command line to determine directory to upload
const args = Bun.argv.slice(2);
const container = args[0];
const directory = args[1];
let doubleCpu = Boolean(args[2]);

const usage = "Usage: bun run s3Uploader.js <container> <directory> [--double-cpu]";

if (!container || container === "--help" || container === "-h") {
  console.log(usage);
  process.exit(1);
}

if (!directory || directory === "--help" || directory === "-h") {
  console.log(usage);
  process.exit(1);
}

// get files from directory
const files = readdirSync(directory);

// sort files by name as these are mostly hls segments
files.sort();

if (!files.includes('index.m3u8')) {
  const warningEmoji = String.fromCodePoint(0x1F6A8);
  console.log(`${warningEmoji} No index.m3u8 file found in directory, unsure if this is a valid HLS directory`);
  process.exit(1);
}

// Get CPU count for parallel uploads
if (doubleCpu) {
  console.log("Doubling CPU count for parallel uploads");
}
const cpuCount = cpus().length * (doubleCpu ? 2 : 1);
const splitFiles = [];

// Split files into chunks for parallel uploads
for (let i = 0; i < cpuCount; i++) {
  splitFiles.push(new Array<string>());
}

for (const file of files) {
  const index = files.indexOf(file);
  splitFiles[index % cpuCount].push(file);
}

const blobService = getBlobService()
const containerClient = blobService.getContainerClient(container)
if (!(await containerClient.exists())) {
  console.log(`Container '${container}' does not exist, attempting to create!`)
  await containerClient.create()
}

// loop through files and upload to azure
console.log(`Uploading ${files.length} files to ${container}...`);

for (const [i, fileGroup] of splitFiles.entries()) {
  const worker = new Worker(new URL('worker.ts', import.meta.url).href);
  const workerId = i + 1;

  worker.addEventListener("open", () => {
    console.log(`[Worker ${workerId}] Ready to accept files!`);
  })

  worker.addEventListener("error", (err) => {
    console.log(err);
    process.exit(1);
  })

  worker.addEventListener("message", (event) => {
    if (event.data === "done") {
      worker.terminate();
    }
  })

  worker.postMessage({
    container,
    directory,
    files: fileGroup,
    workerId
  });
}

console.log('Upload complete!');