import formidable from "formidable";
import {firstValues} from 'formidable/src/helpers/firstValues.js';
import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";

const db = getFirestore();

const schema = yup.object({

    added: yup.object({
        author_id: yup.string('Имя должно быть строкой')
            .trim('Введите имя').required('Введите имя'),
        text: yup.string('Цитата должна быть строкой')
            .trim('Введите цитату').required('Введите цитату'),
    })
})

export default defineEventHandler(async (event) => {

    // const fsPromises = fs.promises;
    const form = formidable({
        encoding: 'utf-8',
        keepExtensions: true,
        // 2 mb for news image and attachments. override otherwise
        //maxFileSize: 20 * 1024 * 1024,
        //multiples: true,
    });
    //const maxFileSize = 2000000;

    const {files, fields, err} = await new Promise((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
        });
    })

    const added = JSON.parse(fields.data);

    try {

        await schema.validate({
            added,
        });

        const {name} = (await db.collection('authors').doc(added.author_id).get()).data()

        await db.collection('quotes').doc(added.id).update({...added, name})

        return {...added, name};

    } catch (e) {

        if (e.path) {
            event.res.statusCode = 422;
            event.res.end(JSON.stringify({
                msg: e.errors[0]
            }));

        } else {

            event.res.setHeader('Content-Type', 'application/json');
            event.res.statusCode = 401;
            event.res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

        }
    }
})
