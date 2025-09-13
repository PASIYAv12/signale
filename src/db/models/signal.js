const { Schema, model } = require('mongoose');

const SignalSchema = new Schema({
  symbol: String,          // e.g. "BTCUSDT"
  type: { type: String },  // "BUY" or "SELL"
  entry: Number,
  sl: Number,
  tp: Number,
  sizeType: { type: String, enum: ['SMALL','BIG'], default: 'SMALL' },
  status: { type: String, enum: ['ACTIVE','TP_HIT','CLOSED'], default: 'ACTIVE' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('Signal', SignalSchema);
