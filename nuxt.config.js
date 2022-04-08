import {defineNuxtConfig} from 'nuxt3'

export default defineNuxtConfig({

    //vite: false,

    meta: {
        title: 'Цитаты великих философов',
        meta: [
            {
                name: 'keywords',
                content: 'Цитаты великих философов'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'Цитаты великих философов'
            }
        ],
        link: [
            {
                rel: 'stylesheet',
                href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css'
            },
            {rel: 'icon', type: "image/x-icon", href: '/favicon.ico'},
        ],
        /* script: [
             {
                 defer: true,
                 async: true,
                 src: 'https://platform.twitter.com/widgets.js',
             },
            /!* {
                 src: '@/node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js',
             }*!/

         ]*/
    },

    css: ["@/assets/scss/main.scss"],

    vite: {
        server: {
            hmr: {
                overlay: false
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/scss/table.scss";',
                    charset: false,
                },
            },
        },
    },


    buildModules: [
        '~/modules/errorPage',
        // '@intlify/nuxt3'
        //'~/modules/vuei18n',
    ],


})
