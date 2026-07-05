<template>
  <div ref="wrapRef" class="w-full h-full overflow-hidden flex items-center justify-center bg-muted">
    <img ref="imgRef" :src="source" style="max-width: 100%; display: block" />
  </div>
</template>

<script setup lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const store   = useImageStore()
const imgRef  = ref<HTMLImageElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
let cropper: Cropper | null = null

// Always crop from the current base (cropped version or original)
const source = computed(() => store.croppedDataUrl ?? store.originalDataUrl ?? '')

onMounted(() => {
  if (!imgRef.value) return
  cropper = new Cropper(imgRef.value, {
    viewMode: 1,
    movable: true,
    zoomable: true,
    rotatable: true,
    autoCropArea: 1,
    background: false,
  })
})

onUnmounted(() => { cropper?.destroy(); cropper = null })

function apply() {
  if (!cropper) return
  const data   = cropper.getData(true) as CropData
  const canvas = cropper.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096, imageSmoothingQuality: 'high' })
  const url    = canvas.toDataURL('image/jpeg', 0.95)
  store.applyCrop(data, url)
}

defineExpose({ apply })
</script>
