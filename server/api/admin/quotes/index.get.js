import { getFirestore} from 'firebase-admin/firestore';
const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {
        const authorsSnap = await db.collection('authors').select('name', 'id').get();

        const authors = authorsSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        const quotesSnap = await db.collection('quotes').get();

        const quotes = quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            quotes,
            authors
        };

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
        /*res.writeHead(401, {
            "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
        });
        //res.statusCode = 401;
        res.end(JSON.stringify({msg: 'no or expired token'}));*/
    }

})
