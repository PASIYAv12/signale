const axios = require('axios');
const Signal = require('../models/Signal');
const logger = require('pino')();

async function getTickerPrice(symbol) {
  // Binance public endpoint for symbol price
  const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  return parseFloat(res.data.price);
}

// check active signals, if price reaches TP mark -> mark and notify
function startWatcher({ telegram, whatsapp, admins, checkIntervalSec = 20 }) {
  setInterval(async () => {
    try {
      const active = await Signal.find({ status: 'ACTIVE' });
      for (const s of active) {
        const price = await getTickerPrice(s.symbol);
        // for BUY: price >= tp ; for SELL: price <= tp
        let hit = false;
        if (s.type === 'BUY' && price >= s.tp) hit = true;
        if (s.type === 'SELL' && price <= s.tp) hit = true;

        if (hit) {
          s.status = 'TP_HIT';
          await s.save();
          // notify telegram / whatsapp admins
          await telegram.sendTPHit(s);
          for (const a of admins) {
            await whatsapp.sendTPHit(a.phone, s).catch(() => {}); // best effort
          }
          logger.info('TP hit notified', { symbol: s.symbol, price });
        }
      }
    } catch (err) {
      logger.error('Watcher error', err);
    }
  }, checkIntervalSec * 1000);
}

module.exports = { startWatcher, getTickerPrice };
