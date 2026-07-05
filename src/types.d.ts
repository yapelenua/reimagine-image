declare type FilterName = 'none' | 'greyscale' | 'sepia' | 'invert'

declare interface HistoryItem {
  id: string
  imageUrl: string
  preset: Record<string, unknown> | null
}

declare interface SavedPreset {
  id: string
  name: string
  preset: Record<string, unknown>
  created_at: string
}

declare interface CropData {
  x: number
  y: number
  width: number
  height: number
  rotate: number
  scaleX: number
  scaleY: number
}

declare interface Adjustments {
  brightness: number
  contrast: number
  saturation: number
}
