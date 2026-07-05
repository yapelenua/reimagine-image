import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/landing/LandingView.vue'),
      meta: { hideHeader: true, layout: 'landing' },
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/views/editor/EditorView.vue'),
      meta: { requiresAuth: true, layout: 'default' },
    },
    {
      path: '/ui-kit',
      name: 'ui-kit',
      component: () => import('@/views/ui-kit/UiKitView.vue'),
      meta: { layout: 'default' },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/history/HistoryView.vue'),
      meta: { requiresAuth: true, layout: 'default' },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return { name: 'landing' }
  }
})

export default router
