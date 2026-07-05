<template>
  <v-tooltip
    :text="text"
    :location="location"
    :open-delay="openDelay"
    content-class="ui-tooltip-content"
  >
    <template #activator="{ props }">
      <slot :props="props" />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text: string
  location?: 'top' | 'bottom' | 'left' | 'right'
  openDelay?: number
}>(), {
  location: 'top',
  openDelay: 300,
})
</script>

<style>
.v-overlay__content.ui-tooltip-content {
  background: #1c1c1c !important;
  color: #ffffff !important;
  font-size: 0.72rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.01em !important;
  padding: 4px 10px !important;
  border-radius: calc(var(--radius) * 0.75) !important;
  box-shadow: none !important;
}
</style>
