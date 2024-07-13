// import { getUser } from './userApi.js';
// import { getDB } from './db.js';

// function randomNum(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }
// function uniqueId(prefix) {
//     return `${prefix}${randomNum(0, 99999)}`
// }
// export default async function handler(req, res) {
//     const { username } = await getUser(req);
//     const db = await getDB();
//     await db.collection('trainingPlans').deleteMany({ user: username });

//     res.status(200).json({});
// }