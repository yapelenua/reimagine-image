import { supabase } from '@/lib/supabase'

export interface HistoryItem {
  id: string
  imageUrl: string
  preset: Record<string, unknown> | null
}

const BUCKET = 'images'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const useHistoryStore = defineStore('history', () => {
  const items   = ref<HistoryItem[]>([])
  const loading = ref(false)
  const error   = ref<string | null>(null)

  async function fetchHistory() {
    const auth = useAuthStore()
    if (!auth.user) return

    loading.value = true
    error.value   = null

    try {
      const userId = auth.user.id

      const { data: folders, error: listErr } = await supabase.storage
        .from(BUCKET)
        .list(userId, { limit: 200, sortBy: { column: 'name', order: 'desc' } })

      if (listErr) throw listErr

      const imageIds = (folders ?? [])
        .map(f => f.name)
        .filter(name => UUID_RE.test(name))

      const resolved = await Promise.all(imageIds.map(async (imageId) => {
        const base = `${userId}/${imageId}`

        const { data: signed } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(`${base}/image.jpg`, 3600)

        let preset: Record<string, unknown> | null = null
        try {
          const { data: blob } = await supabase.storage.from(BUCKET).download(`${base}/preset.json`)
          if (blob) preset = JSON.parse(await blob.text())
        } catch { /* preset missing */ }

        return { id: imageId, imageUrl: signed?.signedUrl ?? '', preset }
      }))

      items.value = resolved.filter(i => i.imageUrl)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: string) {
    const auth = useAuthStore()
    if (!auth.user) return

    const base = `${auth.user.id}/${id}`
    await supabase.storage.from(BUCKET).remove([`${base}/image.jpg`, `${base}/preset.json`])
    items.value = items.value.filter(i => i.id !== id)
  }

  return { items, loading, error, fetchHistory, deleteItem }
})
