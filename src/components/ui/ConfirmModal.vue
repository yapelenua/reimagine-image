<template>
  <v-dialog :model-value="true" max-width="360" @update:model-value="$emit('cancel')">
    <div style="background: var(--card); border-radius: var(--radius); overflow: hidden;">
      <div style="padding: 20px 20px 12px;">
        <p style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); margin: 0 0 6px;">{{ title }}</p>
        <p v-if="message" style="font-size: 0.825rem; color: var(--muted-foreground); margin: 0; line-height: 1.5;">{{ message }}</p>
      </div>
      <div style="padding: 12px 20px 16px; display: flex; justify-content: flex-end; gap: 8px;">
        <UiButton variant="secondary" size="sm" @click="$emit('cancel')">Cancel</UiButton>
        <UiButton variant="destructive" size="sm" @click="$emit('confirm')">{{ confirmLabel }}</UiButton>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import UiButton from './UiButton.vue'

withDefaults(defineProps<{
  title: string
  message?: string
  confirmLabel?: string
}>(), {
  confirmLabel: 'Delete',
})

defineEmits<{ confirm: []; cancel: [] }>()
</script>
