import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const authModal = ref<'login' | 'register' | null>(null)

  function openLogin() {
    authModal.value = 'login'
  }
  function openRegister() {
    authModal.value = 'register'
  }
  function closeModal() {
    authModal.value = null
  }

  async function init() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  }

  async function signIn(email: string, password: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      closeModal()
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      closeModal()
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    authModal,
    openLogin,
    openRegister,
    closeModal,
    init,
    signIn,
    signUp,
    logout,
  }
})
