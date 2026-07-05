<template>
  <button
    :class="[
      'inline-flex items-center gap-[5px] px-3 py-1 text-[0.8rem] font-medium tracking-[0.01em] rounded-full border cursor-pointer transition-all duration-150 outline-none select-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      modelValue
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-border',
    ]"
    type="button"
    :disabled="disabled"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span v-if="icon" :class="`mdi mdi-${icon} text-sm`" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: boolean
  icon?: string
  disabled?: boolean
}>(), {
  modelValue: false,
  icon: '',
  disabled: false,
})

defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
