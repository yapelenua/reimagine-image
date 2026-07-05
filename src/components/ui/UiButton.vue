<template>
  <button
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center gap-1.5 font-medium tracking-[0.01em] border cursor-pointer transition-all duration-150 outline-none select-none whitespace-nowrap',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
    ]"
    :style="{ borderRadius: 'var(--radius)' }"
    :disabled="disabled || loading"
  >
    <span
      v-if="loading"
      class="w-[13px] h-[13px] border-[1.5px] border-current border-t-transparent rounded-full animate-spin flex-shrink-0"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground border-primary hover:opacity-[0.88]',
  secondary: 'bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground',
  ghost: 'bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground border-destructive hover:opacity-[0.88]',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-[5px] text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}
</script>
