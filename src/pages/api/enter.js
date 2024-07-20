import { getUser, isAdmin } from './userApi.js';
import { sendLog } from '@/telegramBot/bot.js';
export default async function handler(req, res) {
    const user = await getUser(req);
    res.status(200).json({});
    await sendLog(`User ${user.username} entered the site`);
}