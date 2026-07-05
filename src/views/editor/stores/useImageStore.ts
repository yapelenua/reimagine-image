import { supabase } from '@/lib/supabase'


export const useImageStore = defineStore('image', () => {
  // ── Source ───────────────────────────────────────────────────────────
  const originalDataUrl = ref<string | null>(null)
  const fileName        = ref('')
  const originalWidth   = ref(0)
  const originalHeight  = ref(0)

  // After crop is applied we store a new dataUrl; preview always uses this
  const croppedDataUrl  = ref<string | null>(null)
  const cropData        = ref<CropData | null>(null)

  // ── Edits ─────────────────────────────────────────────────────────────
  const adjustments = ref<Adjustments>({ brightness: 100, contrast: 100, saturation: 100 })
  const activeFilter = ref<FilterName>('none')

  // ── UI state ──────────────────────────────────────────────────────────
  const isCropping = ref(false)
  const saving     = ref(false)

  // ── Derived ───────────────────────────────────────────────────────────
  const previewUrl = computed(() => croppedDataUrl.value ?? originalDataUrl.value)

  const cssFilter = computed(() => {
    const { brightness, contrast, saturation } = adjustments.value
    const base = `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`
    const extras: Record<FilterName, string> = {
      none:      '',
      greyscale: ' grayscale(1)',
      sepia:     ' sepia(1)',
      invert:    ' invert(1)',
    }
    return base + extras[activeFilter.value]
  })

  const hasEdits = computed(() =>
    adjustments.value.brightness !== 100 ||
    adjustments.value.contrast   !== 100 ||
    adjustments.value.saturation !== 100 ||
    activeFilter.value !== 'none' ||
    cropData.value !== null
  )

  // ── Actions ───────────────────────────────────────────────────────────
  function loadFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target!.result as string
      originalDataUrl.value = url
      croppedDataUrl.value  = null
      cropData.value        = null
      fileName.value        = file.name
      adjustments.value     = { brightness: 100, contrast: 100, saturation: 100 }
      activeFilter.value    = 'none'
      isCropping.value      = false

      const img = new Image()
      img.onload = () => {
        originalWidth.value  = img.naturalWidth
        originalHeight.value = img.naturalHeight
      }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  function applyCrop(data: CropData, url: string) {
    cropData.value       = data
    croppedDataUrl.value = url
    isCropping.value     = false
  }

  function resetEdits() {
    adjustments.value  = { brightness: 100, contrast: 100, saturation: 100 }
    activeFilter.value = 'none'
    croppedDataUrl.value = null
    cropData.value       = null
  }

  // ── Apply preset ──────────────────────────────────────────────────────
  async function applyPreset(raw: string): Promise<string | null> {
    let preset: Record<string, unknown>
    try {
      preset = JSON.parse(raw)
    } catch {
      return 'Invalid JSON'
    }

    // Reset crop so we always start from the original
    croppedDataUrl.value = null
    cropData.value       = null

    if (preset.adjustments && typeof preset.adjustments === 'object') {
      const a = preset.adjustments as Partial<Adjustments>
      adjustments.value = {
        brightness: a.brightness ?? 100,
        contrast:   a.contrast   ?? 100,
        saturation: a.saturation ?? 100,
      }
    }

    const validFilters: FilterName[] = ['none', 'greyscale', 'sepia', 'invert']
    if (preset.filter && validFilters.includes(preset.filter as FilterName)) {
      activeFilter.value = preset.filter as FilterName
    }

    if (preset.crop && originalDataUrl.value) {
      const c = preset.crop as CropData
      const img = await loadImg(originalDataUrl.value)
      const canvas = document.createElement('canvas')
      canvas.width  = Math.round(Math.abs(c.width))
      canvas.height = Math.round(Math.abs(c.height))
      const ctx = canvas.getContext('2d')!

      if (c.rotate) {
        const rad = (c.rotate * Math.PI) / 180
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(rad)
        ctx.drawImage(img, c.x, c.y, c.width, c.height, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
      } else {
        ctx.drawImage(img, c.x, c.y, c.width, c.height, 0, 0, canvas.width, canvas.height)
      }

      applyCrop(c, canvas.toDataURL('image/jpeg', 0.95))
    }

    return null
  }

  // ── Save to history ───────────────────────────────────────────────────
  async function saveToHistory(): Promise<string | null> {
    const auth = useAuthStore()
    if (!auth.user || !previewUrl.value) return null

    saving.value = true
    try {
      const userId  = auth.user.id
      const imageId = crypto.randomUUID()
      const base    = `${userId}/${imageId}`

      const img = await loadImg(previewUrl.value)
      const canvas = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.filter = cssFilter.value
      ctx.drawImage(img, 0, 0)

      const imageBlob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92))

      const preset = {
        crop:        cropData.value,
        adjustments: adjustments.value,
        filter:      activeFilter.value,
      }
      const presetBlob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' })

      const [imgUp, jsonUp] = await Promise.all([
        supabase.storage.from('images').upload(`${base}/image.jpg`,    imageBlob,  { contentType: 'image/jpeg' }),
        supabase.storage.from('images').upload(`${base}/preset.json`,  presetBlob, { contentType: 'application/json' }),
      ])

      if (imgUp.error)  throw imgUp.error
      if (jsonUp.error) throw jsonUp.error

      return imageId
    } finally {
      saving.value = false
    }
  }

  // ── Export ────────────────────────────────────────────────────────────
  async function exportImage(format: 'image/jpeg' | 'image/png' = 'image/jpeg') {
    if (!previewUrl.value) return
    const img = await loadImg(previewUrl.value)
    const canvas = document.createElement('canvas')
    canvas.width  = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')!
    ctx.filter = cssFilter.value
    ctx.drawImage(img, 0, 0)
    const ext  = format === 'image/jpeg' ? '.jpg' : '.png'
    const name = fileName.value.replace(/\.[^.]+$/, '') + ext
    canvas.toBlob(blob => blob && download(blob, name), format, 0.92)
  }

  function exportJson() {
    const payload = {
      crop:        cropData.value,
      adjustments: adjustments.value,
      filter:      activeFilter.value,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    download(blob, 'preset.json')
  }

  return {
    originalDataUrl, croppedDataUrl, previewUrl,
    fileName, originalWidth, originalHeight,
    cropData, adjustments, activeFilter,
    cssFilter, hasEdits, isCropping,
    loadFile, applyCrop, resetEdits,
    exportImage, exportJson, saveToHistory, applyPreset,
    saving,
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src })
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}
