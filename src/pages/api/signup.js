import clientPromise from '../../mongo.js';

import { encryptData } from '@/crypto.js';


export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db();
    // await db.collection('users').deleteMany({});
    const { username, name, password } = req.body;
    console.log({ username, name, password });

    const users = await db.collection('users').find({ username }).toArray();
    if (users.length > 0) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }

    await db.collection('users').insertOne({
        username,
        name,
        password
    })

    const hashedUsername = encryptData(username);


    const cookieOptions = {
        expires: calculateExpires(),
        path: '/',

    };
    const serializedCookie = cookie.serialize('key', hashedUsername, cookieOptions);
    res.setHeader('Set-Cookie', serializedCookie);
    res.status(200).json({ message: 'User created' })
}