<template>
  <section class="cont pb-2 pt-2">
    <div class="mt-1">
      <h2>Поиск: <em>{{ term }}</em>. Количество результатов: {{ results.length }} </h2>
      <div id="quotes" class="mb-3 mt-3 font-color">
        <template v-for="(quote, i) in results">
          <div v-html="quote.text"/>
          <div class="right mt-1">
            <NuxtLink class="dotted-link" :to="'/author/'+quote.author_id">
              {{ quote.name }}
            </NuxtLink>
          </div>
          <hr v-if="(i+1) !== results.length" class="major">
        </template>
      </div>
    </div>
  </section>


</template>

<script setup>

import {watch} from 'vue';

const results = useResult();
const author = useAuthor();
const term = useTerm();
const route = useRoute();

author.value = 'Поиск';

watch(route, () => {
  author.value = '';
  term.value = '';
  results.value = [];
})

</script>

<style lang="scss" scoped>

.withFooter {
  height: 53vh;
}

</style>