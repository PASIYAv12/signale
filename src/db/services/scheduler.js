const cron = require('node-cron');
const Signal = require('../models/Signal');

function scheduleDaily({ telegram, whatsapp, sendToChatId, admins }) {
  // morning: 07:00 server time, evening: 18:00
  cron.schedule('0 7 * * *', async () => {
    await sendMarketUpdate({ telegram, whatsapp, sendToChatId, admins, when: 'Morning' });
  });

  cron.schedule('0 18 * * *', async () => {
    await sendMarketUpdate({ telegram, whatsapp, sendToChatId, admins, when: 'Evening' });
  });
}

async function sendMarketUpdate({ telegram, whatsapp, sendToChatId, admins, when }) {
  // simple summary: list active signals
  const active = await Signal.find({ status: 'ACTIVE' }).limit(10);
  if (active.length === 0) {
    await telegram.sendSignal({ symbol: 'No active signals', type: 'INFO', entry:'-', sl:'-', tp:'-' });
    return;
  }
  for (const s of active) {
    await telegram.sendSignal(s);
    for (const a of admins) {
      await whatsapp.sendSignalToNumber(a.phone, s).catch(()=>{});
    }
  }
}

module.exports = { scheduleDaily, sendMarketUpdate };
