# Azure Blob Uploader using Bun

This simple script allows you to upload the contents of a local directory to an Azure Blob storage container using the Azure SDK for JavaScript and Bun.js.

Note: This script is currently designed for uploading HLS (HTTP Live Streaming) segments. 

## Prerequisites

Before using this script, ensure that you have the following dependencies and AWS credentials set up:

- Node.js installed on your system.
- Bun installed on your system.
- An Azure storage account created for the uploads.
- Appropriate Azure credentials configured with desired write access.
- A local directory with an `index.m3u8` file and its corresponding media segments.

## Installation

1. Clone or download this repository to your local machine.

2. Install the required dependencies by running the following command in the project directory:

    ```bash
    bun install
    ```

## Usage

To use the S3 uploader script, execute it from the command line with the following arguments:

```bash
bun run process <container> <directory> [--double-cpu]
```

- `<container>`: The name of the Azure blob storage container to which you want to upload the directory contents.
- `<directory>`: The local directory whose contents you want to upload.
- `[--double-cpu]` (optional): Use two threads per CPU for faster upload processing times.

### Example Usage

```bash
bun run process.ts my-container ./my-local-directory --double-cpi
```

## Script Explanation

The script performs the following tasks:

1. Parses command line arguments and checks for proper usage.

2. Initializes the Azure client using the default CLI credentials.

3. Reads the files in the local directory and sorts them by name.

4. Checks if an `index.m3u8` file exists in the directory. This file is commonly found in HLS directories and is used to verify that the directory is an HLS directory.

5. Loops through the files in the directory, reads each file, and uploads it to the specified container.

6. Displays progress messages for each file being uploaded.

7. If an error occurs during the upload process, the script logs the error and exits with an error code.

8. Upon successful completion, the script prints "Upload complete!" to the console.

## Notes

- Be cautious while uploading large files or directories, as Azure may charge you for storage and data transfer fees.
  <i><b>I am not responsible for any charges incurred by using this script.</b></i>

- Ensure that you have proper Azure credentials configured to allow the script to access the specified blob storage container.

- Make sure that the Azure CLI is correctly installed and configured on your system.

- The script will create the appropriate container if it detects that the specified string does not match an existing container.



## License

This script is provided under the [MIT License](LICENSE). Feel free to modify and use it according to your requirements.

If you encounter any issues or have questions, please open an issue in the repository or contact the script's author.