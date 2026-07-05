<template>
  <div
    v-if="orientation === 'vertical'"
    class="w-px self-stretch bg-border flex-shrink-0"
    role="separator"
  />

  <div v-else-if="label" class="flex items-center gap-2.5 w-full" role="separator">
    <div class="flex-1 h-px bg-border" />
    <span
      class="text-[0.7rem] font-medium tracking-[0.06em] uppercase text-muted-foreground whitespace-nowrap"
    >
      {{ label }}
    </span>
    <div class="flex-1 h-px bg-border" />
  </div>

  <div v-else class="w-full h-px bg-border" role="separator" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    label: '',
    orientation: 'horizontal',
  },
)
</script>
