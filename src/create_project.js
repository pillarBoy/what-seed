var child_process = require('child_process')

module.exports = function create(project_name) {
  child_process.spawnSync('mkdir', [project_name])
  child_process.spawn('node', ['/gitdown_seed.js'], {cwd: `${__dirname}/${project_name}`})
    .on('close', function () {
      console.log('项目初始化完成。');
    })
}
