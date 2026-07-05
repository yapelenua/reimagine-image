<template>
  <label
    class="flex flex-col items-center justify-center gap-4 w-full h-full cursor-pointer select-none transition-colors duration-150"
    :class="dragging ? 'bg-accent' : 'bg-background'"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="onDrop"
  >
    <input type="file" accept="image/*" class="hidden" @change="onPick" />

    <div
      class="flex flex-col items-center justify-center gap-4 w-full h-full border-2 border-dashed transition-colors duration-150"
      :style="{ borderColor: dragging ? 'var(--primary)' : 'var(--border)', borderRadius: 'var(--radius)' }"
    >
      <span
        class="mdi mdi-image-plus-outline"
        style="font-size: 2.5rem; color: var(--muted-foreground)"
      />

      <div class="flex flex-col items-center gap-1 text-center">
        <p style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); margin: 0">
          Drop an image here
        </p>
        <p style="font-size: 0.78rem; color: var(--muted-foreground); margin: 0">
          or click to browse — JPEG, PNG, WebP
        </p>
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">

const store   = useImageStore()
const dragging = ref(false)

function onPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) store.loadFile(file)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) store.loadFile(file)
}
</script>
