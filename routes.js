const routes = require('next-routes');

module.exports = routes()
  .add('posts')
  .add('projects')
  .add('project', 'project/:project')
  .add('post', 'post/:post');