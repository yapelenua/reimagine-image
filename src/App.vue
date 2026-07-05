<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-app-bar
      v-if="!route.meta.hideHeader"
      elevation="0"
      height="56"
      :style="{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
      }"
    >
      <template #prepend>
        <RouterLink
          :to="{ name: 'landing' }"
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            padding: 0 8px 0 16px;
          "
        >
          <span
            class="mdi mdi-image-edit-outline"
            style="font-size: 1.2rem; color: var(--primary)"
          />
          <span
            style="
              font-size: 0.875rem;
              font-weight: 600;
              letter-spacing: -0.01em;
              color: var(--foreground);
            "
          >
            ReimagineImage
          </span>
        </RouterLink>
      </template>

      <template #append>
        <div style="display: flex; align-items: center; gap: 4px; padding-right: 12px">
          <UiIconButton
            :icon="isDark ? 'weather-sunny' : 'moon-waning-crescent'"
            :label="isDark ? 'Light mode' : 'Dark mode'"
            variant="ghost"
            size="sm"
            @click="toggleTheme"
          />

          <template v-if="authStore.user">
            <div style="width: 1px; height: 20px; background: var(--border); margin: 0 4px" />
            <span
              style="
                font-size: 0.75rem;
                color: var(--muted-foreground);
                max-width: 160px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              {{ authStore.user.email }}
            </span>
            <UiIconButton
              icon="logout"
              label="Sign out"
              variant="ghost"
              size="sm"
              @click="handleLogout"
            />
          </template>

          <template v-else>
            <div style="width: 1px; height: 20px; background: var(--border); margin: 0 4px" />
            <UiButton variant="ghost" size="sm" @click="authStore.openLogin">Sign in</UiButton>
            <UiButton size="sm" @click="authStore.openRegister">Sign up</UiButton>
          </template>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <RouterView v-slot="{ Component, route: r }">
        <component :is="layouts[(r.meta.layout as string) ?? 'landing']">
          <component :is="Component" />
        </component>
      </RouterView>
    </v-main>

    <LoginModal />
    <RegisterModal />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import LoginModal from '@/views/auth/components/LoginModal.vue'
import RegisterModal from '@/views/auth/components/RegisterModal.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LandingLayout from '@/layouts/LandingLayout.vue'

const layouts: Record<string, unknown> = {
  default: DefaultLayout,
  landing: LandingLayout,
}

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const vuetify = useTheme()

const isDark = ref(true)

/** Read one CSS custom property from :root / .dark */
function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * After toggling the .dark class we read the computed CSS variables and push
 * them into Vuetify's theme registry so Vuetify components (v-slider, v-dialog,
 * v-app-bar…) always match the palette defined in theme.css.
 */
function syncVuetify(name: 'light' | 'dark') {
  Object.assign(vuetify.themes.value[name].colors, {
    primary: cssVar('--primary'),
    secondary: cssVar('--secondary'),
    background: cssVar('--background'),
    surface: cssVar('--card'),
    'surface-variant': cssVar('--accent'),
    error: cssVar('--destructive'),
    'on-background': cssVar('--foreground'),
    'on-surface': cssVar('--card-foreground'),
    'on-primary': cssVar('--primary-foreground'),
    'on-secondary': cssVar('--secondary-foreground'),
    'on-error': cssVar('--destructive-foreground'),
  })
}

function toggleTheme() {
  isDark.value = !isDark.value
  // Update .dark class first — getComputedStyle sees the new values immediately
  document.documentElement.classList.toggle('dark', isDark.value)
  syncVuetify(isDark.value ? 'dark' : 'light')
}

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'landing' })
}

onMounted(() => {
  authStore.init()
  document.documentElement.classList.add('dark')
  syncVuetify('dark')
})
</script>
