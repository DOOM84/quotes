import {getFirestore, FieldPath} from 'firebase-admin/firestore';

const db = getFirestore();

export default async (req, res) => {

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

        const quotes = quotesSnap.docs.map((doc) => {
            return {...doc.data(), id: doc.id}
        })

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            //authors,
            quotes
        }));


    } catch (e) {

        res.statusCode = 404;
        res.end('Error occurred. Try again later...');
        /*res.writeHead(401, {
            "Set-Cookie": `token=; HttpOnly; path=/; max-age=0`,
        });
        //res.statusCode = 401;
        res.end(JSON.stringify({msg: 'no or expired token'}));*/
    }

}