<template>
  <div class="flex flex-col gap-0.5">
    <div class="flex justify-between items-baseline">
      <label class="text-[0.8rem] font-medium tracking-[0.01em] text-foreground">{{ label }}</label>
      <span class="text-[0.75rem] font-semibold tabular-nums text-primary text-right min-w-8">
        {{ modelValue }}<span v-if="unit" class="font-normal text-muted-foreground ml-px">{{ unit }}</span>
      </span>
    </div>

    <v-slider
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      hide-details
      color="primary"
      track-color="secondary"
      class="-mx-1"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <div class="flex justify-between px-1 text-[0.65rem] text-muted-foreground">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: number
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
  disabled?: boolean
}>(), {
  min: 0,
  max: 100,
  step: 1,
  unit: '',
  disabled: false,
})

defineEmits<{ 'update:modelValue': [value: number] }>()
</script>
