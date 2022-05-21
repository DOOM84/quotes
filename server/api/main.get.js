import {getFirestore, FieldPath} from 'firebase-admin/firestore';

const db = getFirestore();

export default defineEventHandler(async (event) => {

    try {

        let quotesRef = db.collection("quotes");

        let key = quotesRef.doc().id;

        let quotesSnap = await quotesRef.where(FieldPath.documentId(), '>=', key)
            .where('status', '==', true)
            .limit(15).get();

        if (quotesSnap.size < 15) {
            quotesSnap = await quotesRef.where(FieldPath.documentId(), '<', key)
                .where('status', '==', true)
                .limit(15).get();
        }

        return quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        })




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
