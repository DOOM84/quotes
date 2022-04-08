import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";

const db = getFirestore();
import fs from "fs";

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/authors/remove' && req.method.toLowerCase() === 'post') {
        try {

            const form = formidable();

            const {id} = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    resolve(firstValues(form, fields))
                });
            })

            const {image, thumbnail} = (await db.collection('authors').doc(id).get()).data();

            await db.collection('authors').doc(id).delete();

            if (fs.existsSync('public' + image)) {
                fs.unlinkSync('public' + image);
            }

            if (fs.existsSync('public' + thumbnail)) {
                fs.unlinkSync('public' + thumbnail);
            }

            res.setHeader('Content-Type', 'application/json');

            res.end(JSON.stringify({
                id
            }));

        } catch (e) {

            console.log(e);

            res.statusCode = 401;
            res.end(JSON.stringify({
                msg: 'Unauthenticated'
            }));
        }
    } else {
        res.statusCode = 404;
        res.end('wrong URL');
    }
}
