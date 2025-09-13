const { Telegraf } = require('telegraf');
const Signal = require('../models/Signal');
const Admin = require('../models/Admin');
const logger = require('pino')();

function formatSignalMessage(signal) {
  return `📡 *PASIYA-MD SIGNALE BOT* 📡\n\n*${signal.type}* - ${signal.symbol}\nEntry: ${signal.entry}\nSL: ${signal.sl}\nTP: ${signal.tp}\nWallet: ${signal.sizeType}\n\nPOWERED_BY PASIYA-MD`;
}

function initTelegram(token, sendToChatId) {
  const bot = new Telegraf(token);

  // basic commands for admin (register, list)
  bot.command('start', (ctx) => ctx.reply('PASIYA-MD Signal Bot is online.'));

  // For demo: send latest active signals to a chat id (group or channel)
  async function sendSignal(signal) {
    const msg = formatSignalMessage(signal);
    // send markdown
    await bot.telegram.sendMessage(sendToChatId, msg, { parse_mode: 'Markdown' });
    logger.info('Telegram signal sent', { symbol: signal.symbol });
  }

  // Send TP hit alert
  async function sendTPHit(signal) {
    const msg = `POWERED_BUY PASIYA-MD SIGNALE BOT\n${signal.symbol} TP HIT ✅`;
    await bot.telegram.sendMessage(sendToChatId, msg);
  }

  return { bot, sendSignal, sendTPHit };
}

module.exports = initTelegram;
bot.command('menu', async (ctx) => {
  const menuMessage = `
📡 *PASIYA-MD SIGNALE BOT* 📡

Owner Numbers:
- 94784548818
- 94766359869

Available Options:
/signals - Show active signals
/tphits - Show recent TP hits
/marketupdate - Show market update
/help - Bot usage info

POWERED_BY PASIYA-MD
`;

  await ctx.reply(menuMessage, { parse_mode: 'Markdown' });
});
