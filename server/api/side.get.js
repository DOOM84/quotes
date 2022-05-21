import {getFirestore} from 'firebase-admin/firestore';

const db = getFirestore();


export default defineEventHandler(async (event) => {

    try {

        const authorsSnap = await db.collection('authors').orderBy('born', 'asc')
            .where('status', '==', true).get();

        return  authorsSnap.docs.map((doc) => {
            return {thumbnail: doc.data().thumbnail, name: doc.data().name, id: doc.id}
        });

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
