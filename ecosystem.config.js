module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",

      // Limite mémoire demandée
      max_memory_restart: "200M",

      // Fichiers de log
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",        // facultatif mais recommandé
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
