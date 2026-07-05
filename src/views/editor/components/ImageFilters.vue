<template>
  <div class="flex flex-wrap gap-1.5">
    <UiChip
      v-for="f in filters"
      :key="f.value"
      :model-value="store.activeFilter === f.value"
      :icon="f.icon"
      :disabled="!store.originalDataUrl"
      @update:model-value="store.activeFilter = f.value"
      >{{ f.label }}</UiChip
    >
  </div>
</template>

<script setup lang="ts">
import UiChip from '@/components/ui/UiChip.vue'

const store = useImageStore()

const filters: { value: FilterName; label: string; icon: string }[] = [
  { value: 'none', label: 'None', icon: 'image-filter-none' },
  { value: 'greyscale', label: 'Greyscale', icon: 'contrast-box' },
  { value: 'sepia', label: 'Sepia', icon: 'palette' },
  { value: 'invert', label: 'Invert', icon: 'invert-colors' },
]
</script>
