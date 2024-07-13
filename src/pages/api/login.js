import { encryptData } from '@/crypto.js';
import clientPromise from '../../mongo.js';

export default async function POST(req, res) {
    const client = await clientPromise;
    const db = client.db();
    const { username, password } = req.body;
    console.log({ username, password });

    const users = await db.collection('users').find({ username }).toArray();
    if (users.length === 0) {
        res.status(400).json({ error: 'User does not exist' });
        return;
    }
    const user = users[0];
    if (user.password !== password) {
        res.status(400).json({ error: 'Password is incorrect' });
        return;
    }
    const hashedUsername = encryptData(username);


    res.setHeader('Set-Cookie', `key=${hashedUsername};Max-Age=365*24*60*60;Path=/;`);
    res.status(200).json({ message: 'User logged in' });

}