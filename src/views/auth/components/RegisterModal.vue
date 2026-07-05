<template>
  <v-dialog
    :model-value="authStore.authModal === 'register'"
    max-width="400"
    @update:model-value="authStore.closeModal"
  >
    <div class="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden">
      <div class="flex items-center gap-3.5 px-6 pt-6 pb-5 border-b border-border">
        <v-avatar color="var(--primary)" rounded="lg" size="36">
          <v-icon color="var(--primary-foreground)" size="20">mdi-account-plus-outline</v-icon>
        </v-avatar>
        <div>
          <h2 class="text-[0.9375rem] font-semibold m-0 leading-[1.2]">Create account</h2>
          <p class="text-[0.8rem] text-muted-foreground m-0 mt-[3px]">Sign up to get started</p>
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

        <div class="flex flex-col gap-1.5">
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
            autocomplete="new-password"
            @click:append-inner="showPassword = !showPassword"
            @keydown.enter="submit"
          >
            <template #append>
              <Transition name="fade">
                <v-chip
                  v-if="password && strengthLabel"
                  size="x-small"
                  :color="strengthColor"
                  variant="tonal"
                >
                  {{ strengthLabel }}
                </v-chip>
              </Transition>
            </template>
          </v-text-field>

          <!-- Strength bar -->
          <Transition name="fade">
            <div v-if="password" class="flex gap-1">
              <v-progress-linear
                v-for="i in 3"
                :key="i"
                :model-value="i <= strengthLevel ? 100 : 0"
                :color="i <= strengthLevel ? strengthColor : 'var(--border)'"
                height="3"
                rounded
                class="flex-1"
              />
            </div>
          </Transition>

          <!-- Requirements -->
          <Transition name="slide">
            <ul v-if="password" class="list-none m-0 mt-1 p-0 flex flex-col gap-1">
              <li
                v-for="req in requirements"
                :key="req.label"
                class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                :class="req.met ? 'text-[#22c55e]' : 'text-muted-foreground'"
              >
                <v-icon size="14" :color="req.met ? '#22c55e' : 'var(--border)'">
                  {{ req.met ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                </v-icon>
                {{ req.label }}
              </li>
            </ul>
          </Transition>
        </div>

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

        <Transition name="fade">
          <v-alert
            v-if="success"
            type="success"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="text-[0.775rem]"
          >
            Check your email to confirm your account
          </v-alert>
        </Transition>
      </div>

      <div class="px-6 pt-1 pb-6 flex flex-col gap-2.5">
        <UiButton
          class="w-full justify-center"
          :loading="authStore.loading"
          :disabled="!!password && strengthLevel < 2"
          @click="submit"
        >
          Sign up
        </UiButton>
        <button
          class="text-[0.775rem] text-muted-foreground bg-transparent border-none cursor-pointer text-center p-0.5 transition-colors duration-150 hover:text-foreground"
          @click="authStore.openLogin"
        >
          Already have an account? <span class="text-primary font-medium">Sign in</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const showPassword = ref(false)

const requirements = computed(() => [
  { label: 'At least 8 characters', met: password.value.length >= 8 },
  { label: 'One uppercase letter', met: /[A-Z]/.test(password.value) },
  { label: 'One number (0–9)', met: /[0-9]/.test(password.value) },
])

const strengthLevel = computed(() => {
  if (!password.value) return 0
  const met = requirements.value.filter(r => r.met).length
  if (met === 0) return 1
  if (met === 1) return 1
  if (met === 2) return 2
  return 3
})

const strengthColor = computed(() => ['', '#ef4444', '#f59e0b', '#22c55e'][strengthLevel.value])

const strengthLabel = computed(() => ['', 'Weak', 'Medium', 'Strong'][strengthLevel.value])

const emailTouched = ref(false)
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

watch(
  () => authStore.authModal,
  val => {
    if (val === 'register') return
    email.value = ''
    password.value = ''
    error.value = ''
    success.value = false
    showPassword.value = false
    emailTouched.value = false
  },
)

async function submit() {
  emailTouched.value = true
  if (!emailValid.value) return
  error.value = ''
  success.value = false
  try {
    await authStore.signUp(email.value, password.value)
    success.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Sign up failed'
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

.slide-enter-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 120px;
}
</style>
