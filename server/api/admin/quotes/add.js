import formidable from "formidable";
import { firstValues } from 'formidable/src/helpers/firstValues.js';
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

export default async (req, res) => {

    if (req.originalUrl === '/api/admin/quotes/add' && req.method.toLowerCase() === 'post') {
       // const fsPromises = fs.promises;
        const form = formidable({
            encoding: 'utf-8',
            keepExtensions: true,
            // 2 mb for news image and attachments. override otherwise
            maxFileSize: 20 * 1024 * 1024,
            //multiples: true,
        });

        const {files, fields, err} = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
            });
        })

        //let keys = Object.keys(files).filter((key) => key !== 'file')

        //console.log(keys);

        const added = JSON.parse(fields.data);

            try {

                await schema.validate({
                    added,
                });


                const {name} = (await db.collection('authors').doc(added.author_id).get()).data()

               const {id} = await db.collection('quotes').add({...added, name});

                res.setHeader('Content-Type', 'application/json');

                res.end(JSON.stringify({result: {...added, id, name}}));

            } catch (e) {

                if (e.path) {
                    res.statusCode = 422;
                    res.end(JSON.stringify({
                        msg: e.errors[0]
                    }));

                } else {

                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 401;
                    res.end(JSON.stringify({msg: 'Ошибка! Вы не авторизованы!'}));

                }
            }

    } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({msg: 'Wrong Url'}));
    }
}

