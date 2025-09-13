require('dotenv').config();
const initTelegram = require('./services/telegramBot');
const initWhatsApp = require('./services/whatsappBot');
const { connect } = require('./db/mongoose');
const Admin = require('./models/Admin');
const { scheduleDaily } = require('./services/scheduler');
const { startWatcher } = require('./services/binanceWatcher');

async function main() {
  await connect(process.env.MONGODB_URI);

  // load admins from env into DB if empty
  const existing = await Admin.find();
  if (existing.length === 0 && process.env.ADMINS) {
    const arr = process.env.ADMINS.split(',');
    for (const p of arr) {
      await Admin.create({ phone: p });
    }
  }
  const admins = await Admin.find();

  // init bots
  const telegram = initTelegram(process.env.TELEGRAM_BOT_TOKEN, /* sendToChatId */ process.env.TELEGRAM_CHAT_ID || admins[0].phone);
  const whatsapp = await initWhatsApp(process.env.WA_SESSION_PATH || './sessions/wa.json');

  // scheduler
  scheduleDaily({ telegram, whatsapp, admins });

  // start price watcher
  startWatcher({ telegram, whatsapp, admins, checkIntervalSec: 30 });

  console.log('All services started');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
