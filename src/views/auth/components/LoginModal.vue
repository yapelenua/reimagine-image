<template>
  <v-dialog
    :model-value="authStore.authModal === 'login'"
    max-width="400"
    @update:model-value="authStore.closeModal"
  >
    <div class="auth-card">

      <div class="auth-header">
        <div class="auth-icon"><span class="mdi mdi-login-variant" /></div>
        <div>
          <h2 class="auth-title">Sign in</h2>
          <p class="auth-subtitle">Enter your credentials to continue</p>
        </div>
      </div>

      <div class="auth-body">

        <!-- Email -->
        <div class="field">
          <label class="field-label">Email address</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="field-input"
            :class="{ 'field-input--error': emailTouched && !emailValid }"
            autocomplete="email"
            @blur="emailTouched = true"
          />
          <Transition name="err">
            <p v-if="emailTouched && !emailValid" class="error-msg">
              <span class="mdi mdi-alert-circle-outline" /> Enter a valid email address
            </p>
          </Transition>
        </div>

        <!-- Password -->
        <div class="field">
          <label class="field-label">Password</label>
          <div class="password-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="field-input"
              :class="{ 'field-input--error': error }"
              autocomplete="current-password"
              @keydown.enter="submit"
            />
            <button class="eye-btn" type="button" tabindex="-1" @click="showPassword = !showPassword">
              <span class="mdi" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>
        </div>

        <!-- Error -->
        <Transition name="err">
          <p v-if="error" class="error-msg" :key="error">
            <span class="mdi mdi-alert-circle-outline" /> {{ error }}
          </p>
        </Transition>

      </div>

      <div class="auth-footer">
        <UiButton class="w-full justify-center" :loading="authStore.loading" @click="submit">
          Sign in
        </UiButton>
        <button class="switch-btn" @click="authStore.openRegister">
          No account? <span>Sign up</span>
        </button>
      </div>

    </div>
  </v-dialog>
</template>

<script setup lang="ts">
const authStore    = useAuthStore()
const router       = useRouter()
const email        = ref('')
const password     = ref('')
const error        = ref('')
const showPassword = ref(false)
const emailTouched = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

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
.auth-card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.auth-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 24px 20px;
  border-bottom: 1px solid var(--border);
}

.auth-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.05rem;
  color: var(--primary-foreground);
}

.auth-title  { font-size: 0.9375rem; font-weight: 600; margin: 0; line-height: 1.2; }
.auth-subtitle { font-size: 0.8rem; color: var(--muted-foreground); margin: 3px 0 0; }

.auth-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.auth-footer { padding: 4px 24px 24px; display: flex; flex-direction: column; gap: 10px; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);
}

.field-input {
  width: 100%;
  padding: 9px 12px;
  font-size: 0.875rem;
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.field-input::placeholder { color: var(--muted-foreground); }

.field-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
}

.field-input--error {
  border-color: var(--destructive);
}

.field-input--error:focus {
  border-color: var(--destructive);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--destructive) 18%, transparent);
}

.password-wrap {
  position: relative;
}

.password-wrap .field-input {
  padding-right: 38px;
}

.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--muted-foreground);
  font-size: 1rem;
  padding: 2px 4px;
  line-height: 1;
  border-radius: 4px;
  transition: color 0.15s;
}
.eye-btn:hover { color: var(--foreground); }

.error-msg {
  font-size: 0.775rem;
  color: var(--destructive);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.switch-btn {
  font-size: 0.775rem;
  color: var(--muted-foreground);
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  padding: 2px;
  transition: color 0.15s;
}
.switch-btn:hover { color: var(--foreground); }
.switch-btn span  { color: var(--primary); font-weight: 500; }

/* Error transition */
.err-enter-active { animation: err-in 0.25s ease; }
.err-leave-active { transition: opacity 0.15s; }
.err-leave-to     { opacity: 0; }

@keyframes err-in {
  0%   { opacity: 0; transform: translateX(-6px); }
  40%  { transform: translateX(4px); }
  70%  { transform: translateX(-2px); }
  100% { opacity: 1; transform: translateX(0); }
}
</style>
