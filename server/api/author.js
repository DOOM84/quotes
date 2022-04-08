import {getFirestore} from 'firebase-admin/firestore';
import * as url from "url";

const db = getFirestore();


export default async (req, res) => {

    try {

        let {id} = url.parse(req.url, true).query;

        const author = (await db.collection('authors').doc(id).get()).data();

        const quotesSnap = await db.collection('quotes').where('author_id', '==', id)
            .limit(12).get();

        const quotes = quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({
            author,
            quotes
        }));

    } catch (e) {
        res.statusCode = 404;
        res.end('Error occured. Try again later...');
    }
}
