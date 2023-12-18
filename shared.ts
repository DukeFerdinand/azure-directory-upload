import {BlobServiceClient} from "@azure/storage-blob";
import {DefaultAzureCredential} from "@azure/identity";

export function getBlobService() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error('Azure Storage accountName not found');

    return new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );
}