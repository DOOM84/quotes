<template>
  <div class="pl-4 pr-4 header-content">
    <div class="w100">
      <NuxtLink to="/index2">Next</NuxtLink>
      <component :is="TheEditor1" :content="content"/>
    </div>
  </div>
</template>

<script setup>
import {ref, shallowRef, onMounted, defineAsyncComponent} from 'vue';

useMeta({
  script: [{
    defer: true,
    //async: true,
    src: '/scripts/ckeditor/ckeditor.js',
  }]
})

const content = ref('DOOM');

const TheEditor1 = shallowRef(null);

onMounted(() => {
  TheEditor1.value = defineAsyncComponent(() => import("../components/TheEditor"));

})

</script>