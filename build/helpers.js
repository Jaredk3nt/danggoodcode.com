const path = require("path");
const fs = require("fs");
// Variables
const fenceRx = /---\n((([^\n]+:)\s{1}[^\n]+\n)+)---/;
const fmLineRx = /([^\n]+):\s{1}([^\n]+)\n/g;

function isFile(pth) {
  return fs.statSync(pth).isFile();
}

function isMdFile(pth) {
  return isFile(pth) && pth.split(".")[1] === "md";
}

function getFullPath(pth) {
  return path.resolve(process.cwd(), ...pth.split(path.sep));
}

function readFile(pth) {
  return fs.readFileSync(pth, "utf8");
}

function readDir(pth) {
  console.log(pth);
  return fs.readdirSync(pth);
}

function writeOut(pth, content) {
  return fs.writeFileSync(pth, content);
}

function parseFrontMatter(content) {
  const fmString = fenceRx.exec(content);
  let data = {};
  while ((matches = fmLineRx.exec(fmString)) !== null) {
    data[matches[1]] = matches[2];
  }
  return data;
}

module.exports = {
  isFile,
  readDir,
  isMdFile,
  readFile,
  writeOut,
  getFullPath,
  parseFrontMatter
};
