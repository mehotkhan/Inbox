<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";

const { startFeedStream } = useFeeds();
const { $dexieDb } = useNuxtApp();
const { getSince, streamSorting, streamLimit, currentSpace } = useStream();
const rawTimeline = ref<any | null>(null);
const nowSync = ref(0);
const nowSyncCount = ref(0);

const target = ref(null);
const loadMoreIsVisible = useElementVisibility(target);
const isLoadMore = ref(true);
nowSync.value = Date.now() / 1000;

onMounted(() => {
  if (currentSpace.value?.relay) {
    startFeedStream();
  }
});

rawTimeline.value = useLiveQuery<any[]>(async () => {
  const query = $dexieDb?.events
    .orderBy("created_at")
    .filter(
      (event: any) =>
        event.spaceId === currentSpace.value.spaceId &&
        event.tags.length === 0 &&
        event.created_at >= getSince.value &&
        event.created_at < nowSync.value,
    )
    .limit(streamLimit.value);

  return streamSorting.value.filter === "asc"
    ? await query?.toArray()
    : await query?.reverse().toArray();
}, [streamLimit, getSince, streamSorting, currentSpace, nowSync]);

watch(currentSpace, (newSpace) => {
  if (newSpace?.relay) {
    startFeedStream();
  }
});

watch(loadMoreIsVisible, async (newLoadMoreIsVisible) => {
  if (newLoadMoreIsVisible) {
    const LoadMore = await isMore();
    if (LoadMore) {
      loadMore();
    } else {
      isLoadMore.value = false;
    }
  }
});

const loadMore = () => {
  streamLimit.value = streamLimit.value + 10;
};

const isMore = async () => {
  const count: any = await $dexieDb?.events
    .filter(
      (event: any) =>
        event.spaceId === currentSpace.value.spaceId &&
        event.tags.length === 0 &&
        event.created_at > getSince.value,
    )
    .count();
  const nowLength = rawTimeline.value.value;
  return count !== nowLength.length;
};
const newIncoming: any = useLiveQuery(
  async () =>
    await $dexieDb?.events
      .orderBy("created_at")
      .filter(
        (event: any) =>
          event.spaceId === currentSpace.value.spaceId &&
          event.tags.length === 0 &&
          event.created_at > nowSync.value,
      )
      .count(),

  [currentSpace, nowSync],
);
watch(newIncoming, async (newNewIncoming: number) => {
  if (newNewIncoming > 0) {
    nowSyncCount.value = newNewIncoming;
  }
});

const updateSync = () => {
  nowSyncCount.value = 0;
  nowSync.value = Date.now() / 1000;
};
</script>
<template>
  <div v-if="rawTimeline === null">
    <div
      v-for="key in [...Array(10)]"
      :key="key"
      class="flex items-center bg-white rounded-md mb-6 p-4 border-1"
    >
      <USkeleton class="h-20 w-20 rounded-full overflow-hidden" />
      <div class="space-y-2 pr-5 w-full">
        <USkeleton class="h-3 w-[30%]" />
        <USkeleton class="h-3 w-[60%]" />
        <USkeleton class="h-3 w-[90%]" />
      </div>
    </div>
  </div>
  <div v-else-if="rawTimeline?.value?.length > 0">
    <UCard
      v-if="nowSyncCount > 0"
      :ui="{
        body: {
          base: 'h-full border-0 text-center',
          padding: 'p-2',
        },
        rounded: 'rounded-md',
        divide: 'divide-0',
        ring: 'ring-0',
      }"
      class="mb-5 cursor-pointer"
      @click="updateSync()"
    >
      <span class="text-md leading-10 text-brown">
        {{ `${nowSyncCount} پست جدید` }}
      </span>
    </UCard>
    <UCard
      v-for="feed in rawTimeline.value"
      :key="feed?.id"
      :ui="{
        body: {
          base: 'h-full border-0 ',
          padding: 'px-4 py-5',
        },
        rounded: 'rounded-md',
        divide: 'divide-0',
        ring: 'ring-0',
        header: {
          padding: 'px-4 pt-5',
        },
        footer: {
          padding: 'px-4 pb-5',
        },
      }"
      class="mb-5 group"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <ProfileUserAvatar :pub="feed?.pubkey" size="md" class="ml-3" />

            <ProfileUserName
              :pub="feed?.pubkey"
              class="text-md"
              :support="true"
            />
            <div class="font-thin text-[.7rem] mr-2">
              • {{ FromNow(feed?.created_at * 1000) }}
            </div>
          </div>
        </div>
      </template>
      <p class="text-md mt-3 leading-10">
        {{ feed?.content }}
      </p>
      <template #footer>
        <div class="border-r-2 pr-2 border-brown">
          <SocialFeedMeta :parent="feed?.id" />
          <SocialFeedLatestReplays :parent="feed?.id" />
        </div>
      </template>
    </UCard>
    <UCard
      v-if="isLoadMore"
      ref="target"
      :ui="{
        body: {
          base: 'h-full border-0 text-center',
          padding: 'p-2',
        },
        rounded: 'rounded-md',
        divide: 'divide-0',
        ring: 'ring-0',
      }"
      class="mb-5"
    >
      <button class="text-md leading-10 text-brown" @click="loadMore">
        بارگذاری بیشتر
      </button>
    </UCard>
  </div>
</template>
