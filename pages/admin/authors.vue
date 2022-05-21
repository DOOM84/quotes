<template>
  <main  class="center pb-2 adminHome" >
    <h1 class="mt-2 left pb-1 mb-2 pl-2 pr-2 admin-title">
      Философы
    </h1>

    <div class="right">
      <button
          type="button"
          class="button btn-dark"

          @click.prevent="addItem">
        Добавить
      </button>
    </div>

    <AdminModalWrap @closeDlg="closeModal" mWidth="1000px" origWidth="100%" :showDlg="showDlg">
      <div v-if="mode === 'edit'" class="flexCentered">
        <img class="pic-thumb" :src="authorToUpdate.thumbnail" alt="">
      </div>

      <div class="form-group">
        <label for="file">Изображение</label>
        <input class="mr-1" ref="file" type="file" id="file" @change="onFileChange"/>
      </div>

      <div class="form-group left">
        <label for="name">Имя</label>
        <input type="text" v-model.trim="authorToUpdate.name" class="form-control " id="name">
      </div>
      <label>Биография</label>

        <TheEditor @updatedContent="updatedContent" :content="authorToUpdate.bio"></TheEditor>

      <div class="form-group left">
        <label for="born">Год рождения</label>
        <input type="text" v-model.trim="authorToUpdate.born" class="form-control " id="born">
      </div>

      <div class="form-group left">
        <label for="death">Год смерти</label>
        <input type="text" v-model.trim="authorToUpdate.death" class="form-control " id="death">
      </div>


      <div class="right mt-2 mr-2 admin-opts">
      <div>
        <label for="status" class="admin-status">Опубликовано</label>
        <input type="checkbox" v-model="authorToUpdate.status" id="status">
      </div>

      <button
          type="button"
          class="button btn-dark"
          @click.prevent="storeItem">
        Сохранить
      </button>
      </div>
    </AdminModalWrap>
    <ClientOnly>
    <AdminDtable @endFilter="toFilter = false"
                 :data="authors"
                 :toFilter="toFilter"
                 :filtering="filtering"
                 :toSearch="['name', 'born', 'death']">
      <template #thead>
        <table-head>
          <div class="flexCentered">
            <strong>Имя</strong>
            <i @click.self="filter('name', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('name', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>

        <table-head>
          <div class="flexCentered">
            <strong>Кол-во цитат</strong>
            <i @click.self="filter('quotes', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('quotes', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Изображение</strong>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Год рождения</strong>
            <i @click.self="filter('born', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('born', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Год смерти</strong>
            <i @click.self="filter('death', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('death', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head>
          <div class="flexCentered">
            <strong>Опубликовано</strong>
            <i @click.self="filter('status', 'asc')" class="fa ml-1 fa-caret-up pointer"></i>
            <i @click.self="filter('status', 'desc')" class="fa fa-caret-down pointer"></i>
          </div>
        </table-head>
        <table-head/>
      </template>

      <template #rows="{row}">
        <table-body>
          {{row.name}}
        </table-body>
        <table-body>
          {{row.quotes}}
        </table-body>
        <table-body>
          <img height="210" :src="row.thumbnail" alt="">
        </table-body>
        <table-body>
          {{row.born}}
        </table-body>
        <table-body>
          {{row.death}}
        </table-body>
        <table-body>
          {{ row.status ? 'Да': 'Нет' }}
        </table-body>
        <table-body>
          <button @click.prevent="updateItem(row)" class="button block btn-dark"><i class="fas fa-edit"></i></button>
          <button @click.prevent="removeItem(row.id)" class="button block btn-dark"><i class="fas fa-trash"></i></button>
        </table-body>
      </template>
    </AdminDtable>
    </ClientOnly>
  </main>
</template>
<script setup>
import {ref} from 'vue';
const {$showToast} = useNuxtApp();
import {useRouter} from 'vue-router';
const router = useRouter();
const file = ref(null);
const selectedFile = ref(null);

//const TheEditor1 = shallowRef(null);

definePageMeta({
  layout: 'admin'
})





const {data: authors, error} = await useAsyncData('adminAuthors', () => $fetch('/api/admin/authors'));

const filtering = ref([]);
const toFilter = ref(false);

function filter(fTerm, dir){
  filtering.value = [fTerm, dir]
  toFilter.value = true;
}

const authorToUpdate = ref({status: false});
const showDlg = ref(false);
const mode = ref(null);

function onFileChange(e) {
  selectedFile.value = file.value.files[0];
}

function closeModal() {
  showDlg.value = false;
  mode.value = null;
  authorToUpdate.value = {status: false}
  selectedFile.value = null;
}

function updateItem(picture) {
  mode.value = 'edit';
  authorToUpdate.value = {...picture}
  showDlg.value = true;
}

function updatedContent(cont){
  authorToUpdate.value.bio = cont;
}


function addItem() {
  mode.value = 'add';
  showDlg.value = true;
  authorToUpdate.value.status = false;
  authorToUpdate.value.bio = '';
}

async function storeItem() {

  const formData = new FormData();
  formData.append('data', JSON.stringify(authorToUpdate.value))

  if (selectedFile.value) {
    formData.append('file', selectedFile.value);
  }

  try {
    $showToast('Обработка...', 'info', 2000);

    if (mode.value === 'edit') {
      const result = await $fetch('/api/admin/authors/edit', {
        method: 'PUT',
        body: formData,
      })
      const ind = authors.value.findIndex(item => item.id === result.id);
      authors.value[ind] = result;
    }

    if (mode.value === 'add') {
      const result = await $fetch('/api/admin/authors/add', {
        method: 'POST',
        body: formData,
      })
      authors.value.unshift(result);
    }

    filter(null, null);

    closeModal();

    $showToast('Сохранено успешно', 'success', 2000);

  } catch (e) {

    if (e.response.status === 422) {

      $showToast(e.response._data.msg, 'error');

    } else if (e.response.status === 403) {

      $showToast('Доступ звапрещен', 'error');

      await router.replace('/404');

    } else {

      $showToast('Ошибка', 'error', 2000);

    }

  }
}

async function removeItem(dbId) {
  if (confirm('Are you sure?')) {
    try {

      const formData = new FormData();
      formData.append('id', dbId);

      $showToast('Обработка...', 'info', 2000);

      const {id} = await $fetch('/api/admin/authors/remove', {
        method: 'DELETE',
        body: formData,
      })

      authors.value.splice(authors.value.findIndex(item => item.id === id), 1);

      filter(null, null);

      $showToast('Успешно удалено', 'success', 2000);

    } catch (e) {

      if (e.response.status === 403) {

        $showToast('Доступ запрешен', 'error');

        await router.replace('/404')

      }
    }
  }
}

</script>

