<template>
  <div class="flex flex-col gap-4">
    <UiSlider
      :model-value="store.adjustments.brightness"
      label="Brightness"
      :min="0" :max="200" unit="%"
      :disabled="!store.originalDataUrl"
      @update:model-value="store.adjustments.brightness = $event"
    />
    <UiSlider
      :model-value="store.adjustments.contrast"
      label="Contrast"
      :min="0" :max="200" unit="%"
      :disabled="!store.originalDataUrl"
      @update:model-value="store.adjustments.contrast = $event"
    />
    <UiSlider
      :model-value="store.adjustments.saturation"
      label="Saturation"
      :min="0" :max="200" unit="%"
      :disabled="!store.originalDataUrl"
      @update:model-value="store.adjustments.saturation = $event"
    />
  </div>
</template>

<script setup lang="ts">

const store = useImageStore()
</script>
