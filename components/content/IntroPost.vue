<script lang="ts" setup>
const { locale } = useI18n();
</script>
<template>
  <div>
    <ContentQuery
      v-slot="{ data }"
      :path="locale + '/notes'"
      find="one"
      :where="{ banner: true }"
      :sort="{ date: -1 }"
    >
      <div
        class="flex flex-col-reverse md:flex-row justify-between items-center h-screen-md"
      >
        <div class="basis-2/2 md:basis-1/2 flex-col justify-start items-center">
          <div class="items-center flex gap-3">
            <h2 class="">
              <NuxtLink :external="false" :to="data?._path" class="">
                {{ data?.title }}
              </NuxtLink>
            </h2>
          </div>

          <p>
            {{ data?.description }}
          </p>
          <NuxtLink
            :external="false"
            :to="data?._path"
            class="mx-4 hover:underline"
          >
            {{ $t("more") }}...
          </NuxtLink>
        </div>
        <div class="w-full md:basis-1/2 flex justify-end items-center">
          <nuxt-img
            preload
            loading="lazy"
            sizes="sm:100vw md:50vw lg:400px"
            class="flex w-full md:max-w-[25rem]"
            :src="data?.thumbnail"
            :alt="data?.title"
            :placeholder="[400]"
          />
        </div>
      </div>
    </ContentQuery>
  </div>
</template>
