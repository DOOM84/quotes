import { getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const authorsSnap = await db.collection('authors').get();

        return  authorsSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        });

    } catch (e) {

        event.res.statusCode = 404;
        event.res.end('Error occurred. Try again later...');
    }

})
