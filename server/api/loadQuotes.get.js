import {getFirestore} from 'firebase-admin/firestore';
const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const {id, offset} = useQuery(event);

        const quotesSnap = await db.collection('quotes').where('author_id', '==', id)
            .limit(5).offset(+offset).get()

        return quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

    } catch (e) {
        event.res.statusCode = 404;
        event.res.end('Error occured. Try again later...');
    }
})
