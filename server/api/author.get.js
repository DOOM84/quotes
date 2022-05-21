import {getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const {id} = useQuery(event);

        const author = (await db.collection('authors').doc(id).get()).data();

        if(!author || !author.status){
            const e = new Error('Not found');
            e.code = '404';
            e.statusCode = 404;

            await Promise.reject(e);
        }

        const quotesSnap = await db.collection('quotes').where('author_id', '==', id)
            .limit(12).get();

        const quotes = quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

        return {
            author,
            quotes
        };

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
