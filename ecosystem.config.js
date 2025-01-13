module.exports = {
  apps: [{
    name: "mon-app",
    script: `${process.cwd()}/index.js`,
    watch: true,
    ignore_watch: ["node_modules", "uploads", "archives"],
    env: {
      NODE_ENV: "development",
    },
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
} 

//pm2 start ecosystem.config.js