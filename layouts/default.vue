<template>
  <div>
  <TheHeader :authors="data.authors"/>
  <main id="home" class="d-flex">
    <div ref="sidenav" class="side">
     <TheSidebar :authors="data.authors"/>
    </div>

    <div class="relative">
      <i @click="closeNav" id="defaultNav" class="fas fa-bars pointer openNav"></i>
    </div>

    <div ref="content" class="ml-7 mr-7 mt-4 main-content">
      <div class="head">
        <div class="mt-2 pb-1 header-title d-flex">
          <span><strong>Цитаты </strong>великих философов</span>
          <ClientOnly>
            <span>{{author}}</span>
          </ClientOnly>
        </div>
      </div>
      <slot/>
    </div>
  </main>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';

const sidenav = ref(null)
const route = useRoute();
const author = useAuthor();

watch(route, () => {
  document.body.classList.remove('noScroll');
})

const {data, error} = await useAsyncData('side', () => $fetch('/api/side'));

function closeNav() {

  if (sidenav.value.style.marginLeft === '-400px') {

    sidenav.value.style.marginLeft = '0';

  } else {
    sidenav.value.style.marginLeft = '-400px';
  }
}
</script>

<style scoped lang="scss">

.side {
  //flex-grow: 1;
  flex-shrink: 0;
  background-color: #f5f6f7;
  font-size: 0.9em;
  width: 400px;
  transition: all 0.5s ease-in-out;
  overflow: hidden;
  position: relative;

  .inner {
    width: 400px;
  }

}

.openNav{
    color: #f56a6a;
    font-size: 2rem;

  position: absolute;
  left: 2.5rem;
  top: 2.5rem;
}



@media(max-width: 1280px) {
  .side{
    display: none;
  }
  .openNav{
    display: none;
  }

}

</style>