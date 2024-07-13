import clientPromise from '../../mongo.js';

export async function getDB() {
    const client = await clientPromise;
    return client.db();
}