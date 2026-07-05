<template>
  <div
    :class="[
      'overflow-hidden',
      !flat && 'bg-card text-card-foreground border border-border',
      hoverable &&
        'cursor-pointer transition-colors duration-150 hover:border-ring hover:bg-accent',
    ]"
    :style="{ borderRadius: 'var(--radius)' }"
  >
    <div
      v-if="$slots.header"
      class="px-5 pt-4 text-sm font-semibold tracking-[0.01em] text-foreground"
    >
      <slot name="header" />
    </div>

    <div class="px-5 py-4 text-sm text-card-foreground">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 pb-4 pt-3 border-t border-border">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    flat?: boolean
    hoverable?: boolean
  }>(),
  {
    flat: false,
    hoverable: false,
  },
)
</script>
