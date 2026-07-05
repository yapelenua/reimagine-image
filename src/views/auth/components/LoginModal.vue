<template>
  <v-dialog
    :model-value="authStore.authModal === 'login'"
    max-width="400"
    @update:model-value="authStore.closeModal"
  >
    <div class="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden">
      <div class="flex items-center gap-3.5 px-6 pt-6 pb-5 border-b border-border">
        <v-avatar color="var(--primary)" rounded="lg" size="36">
          <v-icon color="var(--primary-foreground)" size="20">mdi-login-variant</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-[0.9375rem] font-semibold m-0 leading-[1.2]">Sign in</h2>
          <p class="text-[0.8rem] text-muted-foreground m-0 mt-[3px]">
            Enter your credentials to continue
          </p>
        </div>
      </div>

      <div class="px-6 py-5 flex flex-col gap-3.5">
        <v-text-field
          v-model="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          prepend-inner-icon="mdi-email-outline"
          variant="solo-filled"
          flat
          rounded="pill"
          density="comfortable"
          bg-color="var(--muted)"
          color="var(--primary)"
          :error="emailTouched && !emailValid"
          :error-messages="emailTouched && !emailValid ? ['Enter a valid email address'] : []"
          hide-details="auto"
          autocomplete="email"
          @blur="emailTouched = true"
        />

        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="••••••••"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          variant="solo-filled"
          flat
          rounded="pill"
          density="comfortable"
          bg-color="var(--muted)"
          color="var(--primary)"
          :error="!!error"
          hide-details="auto"
          autocomplete="current-password"
          @click:append-inner="showPassword = !showPassword"
          @keydown.enter="submit"
        />

        <Transition name="fade">
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="text-[0.775rem]"
          >
            {{ error }}
          </v-alert>
        </Transition>
      </div>

      <div class="px-6 pt-1 pb-6 flex flex-col gap-2.5">
        <UiButton class="w-full justify-center" :loading="authStore.loading" @click="submit">
          Sign in
        </UiButton>
        <button
          class="text-[0.775rem] text-muted-foreground bg-transparent border-none cursor-pointer text-center p-0.5 transition-colors duration-150 hover:text-foreground"
          @click="authStore.openRegister"
        >
          No account? <span class="text-primary font-medium">Sign up</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)
const emailTouched = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

watch(
  () => authStore.authModal,
  val => {
    if (val === 'login') return
    email.value = ''
    password.value = ''
    error.value = ''
    showPassword.value = false
    emailTouched.value = false
  },
)

async function submit() {
  emailTouched.value = true
  if (!emailValid.value) return
  error.value = ''
  try {
    await authStore.signIn(email.value, password.value)
    router.push({ name: 'editor' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Sign in failed'
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
