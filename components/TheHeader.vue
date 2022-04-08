<template>
  <div @click="closeNav" ref="overlay" id="overlay" class="bg"></div>
  <i @click="openNav" class="fas fa-bars fa-lg pointer open-side-nav mainHeader"></i>
  <div ref="sideNav" class="sidenav" id="smallSidebar">
    <TheSidebar :authors="authors"/>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
const navbar = ref(null);
const sideNav = ref(null);
const overlay = ref(null);

const router = useRouter();
const route = useRoute();

const props = defineProps({
  //data: Object,
  authors: {type: Array, default: []},
})

function openNav() {
  sideNav.value.style.left = "0px";
  overlay.value.style.visibility = "visible";
  overlay.value.style.opacity = "0.5";
  document.body.classList.toggle('noScroll');

}

function closeNav() {
  sideNav.value.style.left = "-250px";
  overlay.value.style.opacity = "0";
  overlay.value.style.visibility = "hidden";
  document.body.classList.remove('noScroll');

}


watch(route, () => {
  closeNav()
})


</script>



<style scoped lang="scss">


.sidenav{
    width: 250px;
    height: 100%;
    left: -250px;
    position: fixed;
    top: 0;
    overflow-x: hidden;
    transition: 0.5s;
    z-index: 4;
}

#smallSidebar {
  background-color: #f5f6f7;
  font-size: 0.9em;
  width: 250px;
  transition: all 0.5s ease-in-out;
  .inner {
    width: 250px;
    // padding: 2rem;
  }
}

.open-side-nav{
  position: fixed;
  color: #f56a6a;
  font-size: 2rem;
  left: 3rem;
  top: 3rem;
  display: none;
}


@media(max-width: 1280px) {
  .open-side-nav{
    display: block;
  }

}

</style>
