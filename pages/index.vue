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
    <ClientOnly>
    <div v-if="pending" class="center">
      <i class="loader mt-2 fas fa-circle-notch fa-spin fa-3x"></i>
    </div>
    <div v-else class="quotes-box">
        <div class="quote" v-for="quote in quotes">
          <div v-html="quote.text"></div>
          <div class="right mt-1">
            <NuxtLink class="dotted-link" :to="'/author/'+quote.author_id">
              {{ quote.name }}
            </NuxtLink>
          </div>
        </div>
    </div>
    </ClientOnly>
    </div>
</template>

<script setup>
const {data: quotes, error, pending} = await useLazyAsyncData('main', () => $fetch('/api/main'),
    {initialCache: false})
</script>

<style scoped>

</style>