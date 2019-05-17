#!/usr/bin/env node

const {
  getFullPath,
  readFile,
  readDir,
  isMdFile,
  writeOut,
  parseFrontMatter,
} = require('./helpers');
// Variables
const { projectsPath } = require('./config');
const path = getFullPath(projectsPath);

function build() {
  const dir = readDir(path);
  const files = dir.filter(file => isMdFile(`${path}/${file}`));
  const fileData = files.map(file => {
    const content = readFile(`${path}/${file}`);
    const frontMatter = parseFrontMatter(content);
    return {
      fileName: file.split('.')[0],
      title: frontMatter.title,
      date: frontMatter.date,
      content,
    };
  });
  fileData.forEach(fd =>
    writeOut(`${path}/dist/${fd.fileName}.json`, JSON.stringify(fd))
  );
}

build();
