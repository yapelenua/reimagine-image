<template>
  <div class="flex flex-col bg-background" style="height: calc(100vh - 56px)">

    <!-- ── Toolbar ──────────────────────────────────────────────────── -->
    <div
      class="flex items-center gap-1.5 px-4 border-b border-border bg-card flex-shrink-0"
      style="height: 48px"
    >
      <!-- Upload -->
      <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFilePick" />
      <UiButton variant="ghost" size="sm" @click="fileInputRef?.click()">
        <span class="mdi mdi-upload mr-1" />Upload
      </UiButton>

      <div class="w-px h-5 bg-border mx-0.5" />

      <!-- Crop toggle -->
      <UiTooltip text="Crop image" location="bottom">
        <template #default="{ props: p }">
          <UiIconButton
            v-bind="p"
            icon="crop"
            label="Crop"
            :variant="store.isCropping ? 'default' : 'ghost'"
            :disabled="!store.originalDataUrl"
            @click="toggleCrop"
          />
        </template>
      </UiTooltip>

      <!-- Rotate -->
      <UiTooltip text="Rotate 90°" location="bottom">
        <template #default="{ props: p }">
          <UiIconButton
            v-bind="p"
            icon="rotate-left"
            label="Rotate 90° left"
            variant="ghost"
            :disabled="!store.originalDataUrl || store.isCropping"
            @click="rotate90"
          />
        </template>
      </UiTooltip>

      <div class="w-px h-5 bg-border mx-0.5" />

      <!-- Reset -->
      <UiTooltip text="Reset all edits" location="bottom">
        <template #default="{ props: p }">
          <UiIconButton
            v-bind="p"
            icon="restore"
            label="Reset"
            variant="ghost"
            :disabled="!store.hasEdits"
            @click="confirmReset = true"
          />
        </template>
      </UiTooltip>

      <!-- Crop confirm / cancel (inline) -->
      <template v-if="store.isCropping">
        <div class="w-px h-5 bg-border mx-0.5" />
        <span style="font-size: 0.78rem; color: var(--muted-foreground)" class="mx-1">Crop mode</span>
        <UiButton variant="secondary" size="sm" @click="store.isCropping = false">Cancel</UiButton>
        <UiButton size="sm" @click="cropperRef?.apply()">Apply</UiButton>
      </template>

      <div class="flex-1" />

      <!-- Preset -->
      <template v-if="store.originalDataUrl && !store.isCropping">
        <div class="w-px h-5 bg-border mx-0.5" />
        <UiTooltip text="Apply preset from JSON" location="bottom">
          <template #default="{ props: p }">
            <UiIconButton v-bind="p" icon="code-json" label="Apply preset" variant="ghost" @click="presetModal = true" />
          </template>
        </UiTooltip>
      </template>

      <!-- Export / Save actions -->
      <template v-if="store.originalDataUrl && !store.isCropping">
        <UiTooltip text="Export operation log as JSON" location="bottom">
          <template #default="{ props: p }">
            <UiButton v-bind="p" variant="ghost" size="sm" @click="store.exportJson()">
              <span class="mdi mdi-code-json mr-1" />JSON
            </UiButton>
          </template>
        </UiTooltip>
        <UiButton size="sm" variant="secondary" @click="store.exportImage()">
          <span class="mdi mdi-download mr-1" />Export
        </UiButton>
        <UiTooltip v-if="authStore.user" text="Save to History" location="bottom">
          <template #default="{ props: p }">
            <UiButton v-bind="p" size="sm" :loading="store.saving" @click="handleSave">
              <span class="mdi mdi-content-save-outline mr-1" />Save
            </UiButton>
          </template>
        </UiTooltip>
        <UiTooltip v-if="authStore.user" text="Save preset" location="bottom">
          <template #default="{ props: p }">
            <UiIconButton v-bind="p" icon="bookmark-plus-outline" label="Save preset" variant="ghost" @click="savePresetModal = true" />
          </template>
        </UiTooltip>
      </template>
    </div>

    <!-- ── Body ─────────────────────────────────────────────────────── -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Canvas area -->
      <div
        class="flex-1 flex items-center justify-center overflow-hidden relative"
        :class="!store.originalDataUrl ? 'p-10' : store.isCropping ? 'p-6' : ''"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <!-- Empty state: upload zone -->
        <ImageUpload v-if="!store.originalDataUrl" />

        <!-- Crop mode -->
        <ImageCropper v-else-if="store.isCropping" ref="cropperRef" />

        <!-- Preview -->
        <div
          v-else
          class="flex items-center justify-center w-full h-full overflow-auto p-6"
        >
          <img
            :src="store.previewUrl!"
            :style="{ filter: store.cssFilter, maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }"
          />
        </div>
      </div>

      <!-- ── Sidebar ────────────────────────────────────────────────── -->
      <aside
        class="flex-shrink-0 border-l border-border bg-card flex flex-col overflow-y-auto"
        style="width: 260px"
      >

        <!-- Section: Adjustments -->
        <div class="flex flex-col gap-4 p-5">
          <p class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase m-0" style="color: var(--muted-foreground)">
            Adjustments
          </p>
          <ImageAdjustments />
        </div>

        <UiDivider />

        <!-- Section: Filters -->
        <div class="flex flex-col gap-3 p-5">
          <p class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase m-0" style="color: var(--muted-foreground)">
            Filter
          </p>
          <ImageFilters />
        </div>

        <!-- Section: Original preview -->
        <template v-if="store.originalDataUrl">
          <UiDivider />
          <div class="flex flex-col gap-3 p-5">
            <p class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase m-0" style="color: var(--muted-foreground)">
              Original
            </p>
            <img
              :src="store.originalDataUrl"
              style="width: 100%; display: block; object-fit: contain; border-radius: var(--radius); border: 1px solid var(--border)"
            />
          </div>
        </template>

        <!-- Image info -->
        <div
          v-if="store.originalDataUrl"
          class="mt-auto p-4 border-t border-border flex flex-col gap-0.5"
        >
          <p
            class="truncate"
            style="font-size: 0.72rem; font-weight: 500; margin: 0; color: var(--foreground)"
            :title="store.fileName"
          >{{ store.fileName }}</p>
          <p style="font-size: 0.7rem; margin: 0; color: var(--muted-foreground)">
            {{ store.originalWidth }} × {{ store.originalHeight }} px
          </p>
          <p v-if="store.cropData" style="font-size: 0.7rem; margin: 0; color: var(--muted-foreground)">
            Cropped: {{ Math.round(store.cropData.width) }} × {{ Math.round(store.cropData.height) }}
          </p>
        </div>

      </aside>
    </div>

  </div>

  <PresetModal     v-if="presetModal"     @close="presetModal = false" />
  <SavePresetModal v-if="savePresetModal" @close="savePresetModal = false" />
  <ConfirmModal
    v-if="confirmReset"
    title="Reset all edits?"
    message="All adjustments, filters and crop will be removed."
    confirm-label="Reset"
    @confirm="store.resetEdits(); confirmReset = false"
    @cancel="confirmReset = false"
  />

  <v-snackbar v-model="snackbar" :color="snackColor" location="bottom right" :timeout="3000">
    {{ snackMsg }}
  </v-snackbar>

</template>

<script setup lang="ts">
import ImageUpload      from './components/ImageUpload.vue'
import ImageCropper     from './components/ImageCropper.vue'
import ImageAdjustments from './components/ImageAdjustments.vue'
import ImageFilters     from './components/ImageFilters.vue'
import PresetModal      from './components/PresetModal.vue'
import SavePresetModal  from './components/SavePresetModal.vue'

const store        = useImageStore()
const authStore    = useAuthStore()
const cropperRef   = ref<InstanceType<typeof ImageCropper> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const presetModal     = ref(false)
const savePresetModal = ref(false)
const confirmReset    = ref(false)
const snackbar = ref(false)
const snackMsg = ref('')
const snackColor = ref<'success' | 'error'>('success')

async function handleSave() {
  try {
    await store.saveToHistory()
    snackMsg.value   = 'Saved to history'
    snackColor.value = 'success'
  } catch (e) {
    snackMsg.value   = (e as Error).message ?? 'Save failed'
    snackColor.value = 'error'
  }
  snackbar.value = true
}

function onFilePick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) store.loadFile(file)
}

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files[0]
  if (file?.type.startsWith('image/')) store.loadFile(file)
}

function toggleCrop() {
  if (store.isCropping) {
    store.isCropping = false
  } else {
    store.isCropping = true
  }
}

async function rotate90() {
  if (!store.previewUrl) return
  const img = await loadImg(store.previewUrl)
  const canvas = document.createElement('canvas')
  canvas.width  = img.naturalHeight
  canvas.height = img.naturalWidth
  const ctx = canvas.getContext('2d')!
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)
  const url = canvas.toDataURL('image/jpeg', 0.95)
  store.applyCrop(
    { x: 0, y: 0, width: canvas.width, height: canvas.height, rotate: -90, scaleX: 1, scaleY: 1 },
    url,
  )
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src })
}
</script>
