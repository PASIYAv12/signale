const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState } = require('@adiwajshing/baileys');
const pino = require('pino');
const logger = pino();
const path = require('path');

async function initWhatsApp(sessionPath) {
  const { state, saveState } = useSingleFileAuthState(sessionPath);
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveState);

  async function sendSignalToNumber(numberE164, signal) {
    const text = `📡 PASIYA-MD SIGNALE BOT\n\n${signal.type} ${signal.symbol}\nEntry: ${signal.entry}\nSL: ${signal.sl}\nTP: ${signal.tp}\nWallet: ${signal.sizeType}`;
    // Baileys expects id like "94766359869@s.whatsapp.net"
    const id = `${numberE164}@s.whatsapp.net`;
    await sock.sendMessage(id, { text });
    logger.info('WA sent', { to: numberE164 });
  }

  async function sendTPHit(numberE164, signal) {
    const text = `POWERED_BUY PASIYA-MD SIGNALE BOT\n${signal.symbol} TP HIT ✅`;
    const id = `${numberE164}@s.whatsapp.net`;
    await sock.sendMessage(id, { text });
  }

  return { sock, sendSignalToNumber, sendTPHit };
}

module.exports = initWhatsApp;
