import formidable from "formidable";
import {firstValues} from 'formidable/src/helpers/firstValues.js';
import slugify from "slugify";
import {
    getFirestore
} from "firebase-admin/firestore";
import * as yup from "yup";

const db = getFirestore();

import prepareFileInfo from "~/helpers/upload/prepareFileInfo";
import uploadFile from "~/helpers/upload/uploadFile";


const schema = yup.object({

    added: yup.object({
        name: yup.string('Имя должно быть строкой')
            .trim('Введите имя').required('Введите имя'),
    })
})

const fileSchema = yup.object().shape({
    file: yup.mixed().required('Добавьте изображение'),
})

export default defineEventHandler(async (event) => {

    const form = formidable({
        encoding: 'utf-8',
        keepExtensions: true,
        // 2 mb for news image and attachments. override otherwise
        maxFileSize: 20 * 1024 * 1024,
        //multiples: true,
    });

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    //const maxFileSize = 2000000;

    const {files, fields, err} = await new Promise((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            resolve({files: firstValues(form, files), fields: firstValues(form, fields), err})
        });
    })

    const added = JSON.parse(fields.data);

    if (err || (files.file && !allowedTypes.includes(files.file.mimetype))/*|| files.avatar.size > maxFileSize*/) {
        event.res.statusCode = 422;
        event.res.end(JSON.stringify({msg: 'Неверный тип или размер файла превышен'}));
    } else {

        try {

            await schema.validate({
                added,
            });

            await fileSchema.validate({
                file: files.file
            });

            added.id = slugify(added.name, {strict: true, lower: true});
            added.born = +added.born;
            added.death = +added.death;

            const picPath = prepareFileInfo(files.file.newFilename, '/public/img/authors/');

            const {mainImage, thumbnail} = await uploadFile(files.file, '/public/', {
                mainImage: true,
                mainImagePath: picPath,
                mainImageWidth: 400,
                mainImageHeight: null,
                thumbnail: true,
                thumbnailPath: prepareFileInfo(files.file,
                    '/public/img/authors/thumbnails/',
                    picPath.substring(picPath.lastIndexOf('/') + 1)),
                thumbnailWidth: 150,
                thumbnailHeight: null
            });

            added.image = mainImage.substring(mainImage.indexOf('/img'));
            added.thumbnail = thumbnail.substring(thumbnail.indexOf('/img'));

            await db.collection('authors').doc(added.id).set(added);

            return added;

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
    }
})

/*async function uploadImg(file, added){

    let uploadPath = file.filepath;
    let fileName = file.newFilename;
    let ext = fileName.substring(fileName.indexOf('.') + 1);

    let nameWithSalt = Date.now() + getRandom(10000000, 1) + (+new Date).toString(36).slice(-5);

    let newPath = 'public/img/authors/' + nameWithSalt + '.' + ext;
    let thumbnail = 'public/img/authors/thumbnails/'+ nameWithSalt + '.' + ext;

        added.image = newPath.substring(6);
        added.thumbnail = thumbnail.substring(6);



         await db.collection('authors')
            .doc(added.id).set(added);
        //added.id = id;
        await sharp(uploadPath).resize({/!*height: 120,*!/ width: 100, fit: 'outside'})
            .toFile(thumbnail)
        await sharp(uploadPath).resize({/!*height: 500, *!/ width: 210, fit: 'outside', /!*position: 'right top',*!/})
            .toFile(newPath)
}*/

