import dotenv from 'dotenv';
import path from 'path';
import TelegramBot from "node-telegram-bot-api";
if (process.env.NODE_ENV === 'development') {
    dotenv.config({
        path: path.resolve('/Users/gil/Projects/training-plan/.env')
    });
}
const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true })
const logsChatId = '-4217945529'
const groupChatId = '-4217945529'

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log({ chatId });
//     bot.sendMessage(chatId, 'Received your message');
// })

export const sendLog = (message) => {
    // return bot.sendMessage(logsChatId, message);
}

export const sendMessage = (message) => {
    return bot.sendMessage(groupChatId, message);
}




