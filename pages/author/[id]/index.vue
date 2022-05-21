<template>
  <section class="mb-3">
    <ClientOnly>
      <div v-if="pending || error" class="center loader mt-2">
        <i class="fas fa-circle-notch fa-spin fa-3x grey"></i>
      </div>
      <div v-else>
        <header class="main mt-3">
          <h2>{{ data.author.name }} ({{ data.author.born }} - {{ data.author.death }})</h2>
        </header>

        <span class="main"><img :src="data.author.image" alt=""></span>

        <transition name="bio">
          <div v-if="showBio" class="mb-2 bio" id="bioFull" v-html="data.author.bio"/>
        </transition>


        <div class="showBio">
          <button @click="toggleBio" class="button small">{{ btnTitle }}</button>
        </div>

        <hr class="major">
        <h2>Цитаты:</h2>
        <div id="quotes" class="mb-3 font-color">
          <template v-for="(quote, i) in data.quotes">
            <div v-html="quote.text"/>
            <hr v-if="(i+1) !== data.quotes.length" class="major">
          </template>
        </div>

        <button :disabled="loading" @click.prevent="loadQuotes" id="showMore" class="button small special fit w100">
          Показать еще <i v-if="showIcon" class="fas fa-circle-notch fa-spin"></i>
        </button>
      </div>

    </ClientOnly>
  </section>
</template>

<script setup>

import {ref, computed, watch} from 'vue';

const author = useAuthor();

const route = useRoute();

const router = useRouter();

const {data, error, pending} = await useLazyAsyncData('author', () => $fetch('/api/author',
    {params: {id: route.params.id}}), {initialCache: false})

if (process.server && error?.value) {
  throwError(error.value)
}

watch(error, (newError) => {
  if (!!newError) {
    router.replace('/404')
  }
})

watch(data, (newData) => {
  if (newData) {
    author.value = newData.author.name
  }
})

const title = computed(() => 'Цитаты великих философов - ' + (data.value ? data.value.author.name : ''))

useHead({
  title: title
})

watch(route, () => {
  author.value = '';
})

const showBio = ref(false);
const loading = ref(false);
const showIcon = ref(false);

function toggleBio() {
  showBio.value = !showBio.value
}

const btnTitle = computed(() => !showBio.value ? 'Показать биографию' : 'Скрыть биографию');

async function loadQuotes() {

  if(loading.value){return}

  loading.value = true;
  showIcon.value = true;

  try {
    const quotes = await $fetch('/api/loadQuotes',
        {params: {id: route.params.id, offset: data.value.quotes.length}});

    if (quotes.length) {
      data.value.quotes.push(...quotes);
      loading.value = false;
      showIcon.value = false;
    }else{
      loading.value = true;
      showIcon.value = false;
    }
  }catch (e) {
    showIcon.value = false;
  }
}


</script>

<style scoped lang="scss">

.main img {
  width: 20%;
  float: right;
  border-radius: 0.375em;
  margin-left: 1rem;
}

.button {
  appearance: none;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  background-color: transparent;
  border-radius: 0.375em;
  border: 0;
  box-shadow: inset 0 0 0 2px #f56a6a;
  color: #f56a6a !important;
  cursor: pointer;
  display: inline-block;
  font-family: "Roboto Slab", serif;
  font-size: 0.8em;
  font-weight: 700;
  height: 3.5em;
  letter-spacing: 0.075em;
  line-height: 3.5em;
  padding: 0 2.25em;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;

  &:hover {
    background-color: rgba(245, 106, 106, 0.05);
  }
}


.special {
  background-color: #f56a6a;
  box-shadow: none;
  color: #ffffff !important;

  &:hover {
    background-color: #f67878;
  }

  &:active {
    background-color: #f45c5c;
  }
}

.small {
  font-size: 0.6em;
}

.fit {
  display: block;
  margin: 0 0 1em 0;
  width: 100%;
}


@media(max-width: 736px) {
  .main img {
    width: 30%;
  }
}

@media(max-width: 480px) {
  .main img {
    width: 50%;
  }
  .showBio{
    text-align: center;
    button {
      margin-top: 2rem;
    }
  }
}


</style>