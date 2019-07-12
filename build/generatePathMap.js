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
    const projects = projectPaths();
    const posts = postPaths();
    console.log(posts);
    return {
        ...defaults,
        ...projects,
        ...posts
    };
}

function projectPaths() {
    const path = getFullPath(projectsPath + '/dist');
    const files = readDir(path);
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
    const path = getFullPath(postsPath + '/dist');
    const files = readDir(path);
    return files.reduce((acc, file) => {
        const fileName = file.split(".")[0];
        return {
            ...acc,
            [`/post/${fileName}`]: {
                page: "/post",
                query: { post: fileName }
            }
        };
    }, {});
}

module.exports = generatePathMap;