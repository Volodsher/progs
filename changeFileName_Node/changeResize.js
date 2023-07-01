const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = process.argv[2]; // Directory path
const searchName = process.argv[3]; // Search name
const newName = process.argv[4]; // New name
const widthSize = parseInt(process.argv[5]); // Width size

function processImage(imagePath, outputDirectory) {
  const imageFileName = path.basename(imagePath, '.jpg');
  const newFileName = `${newName}.jpg`; // Use the provided newName as the new filename

  // Resize to the specified width size
  sharp(imagePath)
    .resize(widthSize)
    .toFile(path.join(outputDirectory, newFileName), (err) => {
      if (err) {
        console.error(`Error resizing image to ${widthSize} pixels:`, err);
      } else {
        console.log(
          `Image resized to ${widthSize} pixels and saved as:`,
          newFileName
        );
      }
    });
}

function searchAndResizeImages(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${directory}`, err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting file stats: ${filePath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively search and resize images in subdirectories
          searchAndResizeImages(filePath);
        } else if (path.extname(file) === '.jpg' && file.includes(searchName)) {
          // Resize the image
          processImage(filePath, directory);
        }
      });
    });
  });
}

// Validate command-line arguments
if (!directoryPath || !searchName || !newName || isNaN(widthSize)) {
  console.error(
    'Invalid command-line arguments. Usage: node program.js <directory> <searchName> <newName> <widthsize>'
  );
  process.exit(1);
}

// Start searching and resizing images in the specified directory and its subdirectories
searchAndResizeImages(directoryPath);
