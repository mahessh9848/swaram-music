require('dotenv').config();

module.exports = {
  oracle: {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    clientDir: process.env.ORACLE_CLIENT_DIR,
  },
  port: parseInt(process.env.PORT, 10) || 3001,
};
