const { getFullPath, readDir } = require("./helpers");
// Variables
const { projectsPath, postsPath } = require("./config");

const defaults = {
    "/": { page: "/" },
    "/404": { page: "/_error" },
    "/projects": { page: "/projects" },
    "/posts": { page: "/posts" }
};

async function generatePathMap() {
    const projects = projectPaths()
    console.log(projects);
    return {
        ...defaults,
        ...projects
    };
}

function projectPaths() {
    const path = getFullPath(projectsPath + '/dist');
    console.log(path);
    const files = readDir(path);
    console.log(files);
    return files.reduce((acc, file) => {
        const fileName = file.split(".")[0];
        return {
            ...acc,
            [`/project/${fileName}`]: {
                page: "/project",
                query: { project: fileName }
            }
        };
    }, {});
}

function postPaths() {
    return {};
}

module.exports = generatePathMap;