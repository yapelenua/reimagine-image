<template>
  <button
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center border flex-shrink-0 cursor-pointer transition-all duration-150 outline-none',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :style="{ borderRadius: 'var(--radius)' }"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
    type="button"
  >
    <span :class="`mdi mdi-${icon}`" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  icon: string
  label?: string
  variant?: 'default' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  label: '',
  variant: 'ghost',
  size: 'md',
  disabled: false,
})

const variantClasses: Record<string, string> = {
  ghost: 'bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground',
  default: 'bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-transparent text-destructive border-transparent hover:bg-destructive hover:text-destructive-foreground',
}

const sizeClasses: Record<string, string> = {
  sm: 'w-7 h-7 text-sm',
  md: 'w-[34px] h-[34px] text-base',
  lg: 'w-10 h-10 text-xl',
}
</script>
