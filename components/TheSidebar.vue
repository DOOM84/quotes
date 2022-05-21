<template>
  <div ref="innerSide" id="inner">
    <div class="center pa-2 search-box">
      <input @keyup.enter="search" v-model="searchTerm" type="text" placeholder="Поиск" class="search-field">
    </div>
    <div class="pa-2">
      <div class="mt-2 left">
        <div class="menu-title">
          <h2>Меню</h2>
        </div>
      </div>
      <div class="mt-2 left">
        <div class="mt-3 menu-item">
          <NuxtLink to="/">Главная</NuxtLink>
        </div>
        <div class="mt-3 menu-item">
          <NuxtLink to="/about">О сайте</NuxtLink>
        </div>
      </div>
      <div class="mt-3 left">
        <div class="menu-title">
          <h2>Философы</h2>
        </div>
      </div>
      <div class="mini-posts mt-3">
        <article class="center" v-for="author in authors">
          <NuxtLink class="link-image" :to="'/author/'+author.id">
            <img :src="author.thumbnail" alt="">
          </NuxtLink>
          <p class="center">{{author.name}}</p>
        </article>
      </div>

      <div class="mt-3 left">
        <div class="menu-title">
          <h2> Связаться с нами</h2>
        </div>
      </div>

      <div class="mt-3 pb-3 contact-item">
        <i class="fas fa-globe"></i>
        <a target="_blank" href="https://designs.network">Разработчик</a>
      </div>

      <div class="mt-3 left pb-2 font-color">
        © {{ new Date().getFullYear() }}
        <NuxtLink class="copyright" to="/">Цитаты великих философов</NuxtLink>
        All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref, /*watch*/} from "vue";

onMounted(() => {
  //window.addEventListener("scroll", handleScroll);
})

const route = useRoute();
const router = useRouter();
const cached = useCachedinfo();
const term = useTerm();
const searchResult = useResult();

const props = defineProps({
  //data: Object,
  authors: {type: Array, default: []},
})

const searchTerm = ref(null);


async function search(){

  if(!cached.value.length){

    const quotes = await $fetch('/api/search',
        /*{params: {term: searchTerm.value}}*/);

    cached.value = [...quotes];
  }

  let strippedTerm = searchTerm.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, '');

  strippedTerm = strippedTerm.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");

  if (!strippedTerm || strippedTerm.length < 3) {
    return
  }

  term.value = strippedTerm;

  const regex = new RegExp(strippedTerm, 'gi');

  searchResult.value = [...cached.value.filter(quote => !!quote.text.match(regex))];

  if(route.path !== '/search'){

    router.push('/search');

  }
}


const innerSide = ref(null);
const scrolled = ref(false);



function handleScroll(event) {

  //console.log(document.querySelector('.open-side-nav').style.display);
  if (innerSide.value.offsetHeight < (window.innerHeight + window.scrollY)) {
    if (!scrolled.value) {
      const offset = window.scrollY
      innerSide.value.style.position = 'fixed';
      innerSide.value.style.top = '-' + offset + 'px';
      scrolled.value = true;
    }
  } else {
    innerSide.value.style.position = '';
    scrolled.value = false;
  }
}

</script>

<style scoped>

</style>