<script setup lang="ts">
const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      shortcuts: ["E"],
      click: () => {
        console.log("Edit");
      },
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
      shortcuts: ["D"],
      disabled: true,
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      shortcuts: ["⌘", "D"],
    },
  ],
];
const { currentComments } = useComments();
</script>

<template>
  <div class="flex w-full flex-col">
    <UCard
      v-for="comment in currentComments"
      :key="comment.id"
      class="text-base dark:bg-gray-900 mb-10 w-full"
      :ui="{ring:'ring-0',shadow:'shadow-none',base:'border-r-4 border-primary',rounded:'rounded-sm'}"
    >
      <template #header>
        <div class="w-full flex justify-between">
          <div class="flex items-center gap-2">
            <UAvatar
              chip-color="primary"
              chip-text=""
              chip-position="top-right"
              size="sm"
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="Avatar"
            />
            <span> username </span>
            <span class="font-thin text-xs">سه ساعت پیش</span>
            <span class="font-thin text-xs">
              {{ comment.seen ? "Send" : "Sending" }}</span
            >
          </div>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton
              variant="ghost"
              color="white"
              label="گزینه ها"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
          </UDropdown>
        </div>
      </template>
      <p class="text-gray-500 dark:text-gray-400">
        {{ comment.content }}
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">پاسخ</div>
      </template>
    </UCard>
  </div>
</template>
