const fs = require('fs');
const path = require('path');

function findAndRenameFiles(directory, searchName, newName) {
  // Read the contents of the current directory
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${directory}`, err);
      return;
    }

    // Iterate over each file/directory
    files.forEach((file) => {
      const filePath = path.join(directory, file);

      // Check if the current item is a directory
      if (fs.statSync(filePath).isDirectory()) {
        // Recursively search and rename files in subdirectories
        findAndRenameFiles(filePath, searchName, newName);
      } else if (file === searchName) {
        // Check if the current file matches the search name
        const newFilePath = path.join(directory, newName);

        // Rename the file
        fs.rename(filePath, newFilePath, (err) => {
          if (err) {
            console.error(`Error renaming file: ${filePath}`, err);
          } else {
            console.log(`Renamed file: ${filePath} to ${newFilePath}`);
          }
        });
      }
    });
  });
}

// Usage: node app.js <directory> <searchName> <newName>
const directory = process.argv[2];
const searchName = process.argv[3];
const newName = process.argv[4];

if (!directory || !searchName || !newName) {
  console.error('Please provide the directory, search name, and new name.');
  process.exit(1);
}

// Start searching and renaming files in the specified directory
findAndRenameFiles(directory, searchName, newName);
