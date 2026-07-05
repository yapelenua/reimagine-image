import { supabase } from '@/lib/supabase'

export interface SavedPreset {
  id: string
  name: string
  preset: Record<string, unknown>
  created_at: string
}

export const usePresetsStore = defineStore('presets', () => {
  const presets = ref<SavedPreset[]>([])
  const loading = ref(false)

  async function fetchPresets() {
    const auth = useAuthStore()
    if (!auth.user) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('savedpresets')
        .eq('id', auth.user.id)
        .single()

      if (error) throw error
      presets.value = data?.savedpresets ?? []
    } finally {
      loading.value = false
    }
  }

  async function savePreset(name: string, preset: Record<string, unknown>) {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('Not authenticated')

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('savedpresets')
      .eq('id', auth.user.id)
      .single()
    if (fetchError) throw fetchError

    const current: SavedPreset[] = data?.savedpresets ?? []
    const entry: SavedPreset = {
      id: crypto.randomUUID(),
      name,
      preset,
      created_at: new Date().toISOString(),
    }
    const updated = [entry, ...current]

    const { error } = await supabase
      .from('profiles')
      .update({ savedpresets: updated })
      .eq('id', auth.user.id)

    if (error) throw error
    presets.value = updated
  }

  async function deletePreset(id: string) {
    const auth = useAuthStore()
    if (!auth.user) return

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('savedpresets')
      .eq('id', auth.user.id)
      .single()
    if (fetchError) throw fetchError

    const current: SavedPreset[] = data?.savedpresets ?? []
    const updated = current.filter(p => p.id !== id)

    const { error } = await supabase
      .from('profiles')
      .update({ savedpresets: updated })
      .eq('id', auth.user.id)

    if (error) throw error
    presets.value = updated
  }

  return { presets, loading, fetchPresets, savePreset, deletePreset }
})
