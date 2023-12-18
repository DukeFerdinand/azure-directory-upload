import {readFileSync} from "node:fs";
import {getBlobService} from "./shared.ts";

declare var self: Worker;

if (Bun.isMainThread) {
  throw new Error("This file should not be imported in the main thread");
}

self.onmessage = async (event: MessageEvent) => {
  console.log(event.data);

  const {container, directory, files, workerId} = event.data;
  console.log(`[Worker ${workerId}] received ${files.length} files to upload to ${container}...`);

  const containerClient = getBlobService().getContainerClient(container)

  for (const [i, file] of files.entries()) {
    const directoryName = directory.split('/').pop() || '';

    console.log(`[Worker ${workerId}] Uploading file ${i + 1}/${files.length}...`);

    try {
      const blobClient = containerClient.getBlockBlobClient(directoryName + '/' + file)
      const fileContents = readFileSync(directory + '/' + file)
      await blobClient.upload(fileContents, fileContents.length)
    }
    catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`[Worker ${workerId}] Finished uploading ${files.length} files to ${container}`);
  self.postMessage("done");
}