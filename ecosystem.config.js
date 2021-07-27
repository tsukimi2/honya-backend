module.exports = {
  apps : [{
    name   : "honya-api",
    cwd: './server',
    script : "npm",
    args: "start",
    instances: "max",
    exec_mode: "cluster"
  }]
}
