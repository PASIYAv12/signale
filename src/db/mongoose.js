const mongoose = require('mongoose');
const logger = require('pino')();

async function connect(uri) {
  await mongoose.connect(uri, { dbName: 'pasiyamd' });
  logger.info('MongoDB connected');
}

module.exports = { connect, mongoose };
