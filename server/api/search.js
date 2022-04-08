import { getFirestore} from 'firebase-admin/firestore';
const db = getFirestore();


export default async (req, res) => {

    try {

        const quotesSnap = await db.collection('quotes').get()

        const quotes = quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        })

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            quotes
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
