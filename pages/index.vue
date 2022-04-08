<template>
  <div>
    <div class="header-content">

      <div class="header-text pr-2">
        <h2>
          Приветствуем Вас на нашем сайте
        </h2>

        <p>
          ЗДЕСЬ СОБРАНЫ ЦИТАТЫ ВЕЛИКИХ ФИЛОСОФОВ И МЫСЛИТЕЛЕЙ, КОТОРЫЕ, НА НАШ ВЗГЛЯД, НАИБОЛЕЕ СИЛЬНО ПОВЛИЯЛИ НА УМЫ И
          МИРОВОЗЗРЕНИЕ ЛЮДЕЙ.
        </p>

      </div>
      <div class="ml-1 header-img">
        <img class="w100" src="/img/socrate.jpg" alt="">
      </div>
    </div>
    <div class="quotes-box">
      <ClientOnly>
        <div class="quote" v-for="quote in data.quotes">
          <div v-html="quote.text"></div>
          <div class="right mt-1">
            <NuxtLink class="dotted-link" :to="'/author/'+quote.author_id">
              {{ quote.name }}
            </NuxtLink>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const {data, error} = await useAsyncData('index', () => $fetch('/api/index'));
</script>

<style scoped>

</style>