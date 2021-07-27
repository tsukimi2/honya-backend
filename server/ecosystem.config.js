/*
module.exports = {
  apps : [{
    name   : "honya-api",
    script : "npm",
    args: "start",
    instances: "max",
    exec_mode: "cluster",
    merge_logs: true,
    max_restarts: 20,
    max_memory_restart: "200M"
  }]
}
*/

/*
export default {
  apps : [{
    name   : "honya-api",
    script : "npm",
    args: "start",
    instances: "max",
    exec_mode: "cluster"
  }]
}
*/

export const apps = [{
  name   : "honya-api",
  script : "npm",
  args: "start",
  instances: "max",
  exec_mode: "cluster"
}]