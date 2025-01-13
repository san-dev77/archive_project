const fs = require("fs");
const path = require("path");

/**
 * Creates a directory in the specified path.
 * @param {string} dirPath - The path where the directory should be created.
 * @param {string} dirName - The name of the directory to create.
 */
function createDirectory(dirPath, dirName) {
  const fullPath = path.join(dirPath, dirName);
  console.log(fullPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Directory created at: ${fullPath}`);
  } else {
    console.log(`Directory already exists at: ${fullPath}`);
  }
}
function createDirectorycompplete(dirPath, dirName) {
  const fullPath = path.join(dirPath, dirName);
  console.log(fullPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    createSubdirectory(fullPath, "caisse");
    createSubdirectory(fullPath, "guichet");
    console.log(`Directory created at: ${fullPath}`);
  } else {
    console.log(`Directory already exists at: ${fullPath}`);
  }
}

/**
 * Deletes a directory at the specified path.
 * @param {string} dirPath - The path where the directory should be deleted.
 * @param {string} dirName - The name of the directory to delete.
 */
function deleteDirectory(dirPath, dirName) {
  console.log(dirName);

  const fullPath = path.join(dirPath, dirName);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true });
    console.log(`Directory deleted at: ${fullPath}`);
  } else {
    console.log(`Directory does not exist at: ${fullPath}`);
  }
}

/**
 * Renames a directory at the specified path.
 * @param {string} dirPath - The path where the directory is located.
 * @param {string} oldName - The current name of the directory.
 * @param {string} newName - The new name for the directory.
 */
function renameDirectory(dirPath, oldName, newName) {
  const oldFullPath = path.join(dirPath, oldName);
  const newFullPath = path.join(dirPath, newName);
  if (fs.existsSync(oldFullPath)) {
    fs.renameSync(oldFullPath, newFullPath);
    console.log(`Directory renamed from ${oldName} to ${newName}`);
  } else {
    console.log(`Directory does not exist at: ${oldFullPath}`);
  }
}

/**
 * Creates a directory inside the specified path if it does not exist.
 * @param {string} dirPath - The path where the directory should be created.
 * @param {string} dirName - The name of the directory to create.
 */
function createSubdirectory(dirPath, dirName) {
  const fullPath = path.join(dirPath, dirName);
  console.log(fullPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Subdirectory created at: ${fullPath}`);
  } else {
    console.log(`Subdirectory already exists at: ${fullPath}`);
  }
}

/**
 * Creates a nested directory structure based on the project name in the format "DD/MM/YYYY".
 * @param {string} dateFormat - The date format is in the format "DD/MM/YYYY".
 */
function createNestedDirectory(chemin, dateFormat) {
  const parts = dateFormat.split("/");
  if (parts.length !== 3) {
    console.log(`Invalid project name format: ${dateFormat}`);
    return;
  }

  const [, month, year] = parts;
  const datefull = parts.toString();
  const formattedDate = datefull.replace(/,/g, "-");
  const fullPath = path.join(chemin, year);
  const fullPath2 = path.join(chemin, year, month);
  createSubdirectory(fullPath, month);
  createSubdirectory(fullPath2, formattedDate); // Keep the full name for the directory
}

module.exports = {
  createDirectory,
  createDirectorycompplete,
  createNestedDirectory,
  renameDirectory,
  deleteDirectory,
  createSubdirectory,
};
