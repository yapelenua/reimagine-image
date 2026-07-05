<template>
  <v-dialog
    :model-value="authStore.authModal === 'register'"
    max-width="400"
    @update:model-value="authStore.closeModal"
  >
    <div class="auth-card">

      <div class="auth-header">
        <div class="auth-icon"><span class="mdi mdi-account-plus-outline" /></div>
        <div>
          <h2 class="auth-title">Create account</h2>
          <p class="auth-subtitle">Sign up to get started</p>
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
          <div class="field-label-row">
            <label class="field-label">Password</label>
            <Transition name="fade">
              <span v-if="password && strengthLabel" class="strength-label" :style="{ color: strengthColor }">
                {{ strengthLabel }}
              </span>
            </Transition>
          </div>

          <div class="password-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="field-input"
              :class="{ 'field-input--error': error }"
              autocomplete="new-password"
              @keydown.enter="submit"
            />
            <button class="eye-btn" type="button" tabindex="-1" @click="showPassword = !showPassword">
              <span class="mdi" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>

          <!-- Strength bar -->
          <Transition name="fade">
            <div v-if="password" class="strength-bar">
              <div
                v-for="i in 3"
                :key="i"
                class="strength-seg"
                :class="{ 'strength-seg--active': i <= strengthLevel }"
                :style="i <= strengthLevel ? { background: strengthColor } : {}"
              />
            </div>
          </Transition>

          <!-- Requirements -->
          <Transition name="slide">
            <ul v-if="password" class="req-list">
              <li
                v-for="req in requirements"
                :key="req.label"
                class="req-item"
                :class="{ 'req-item--met': req.met }"
              >
                <span class="mdi" :class="req.met ? 'mdi-check-circle' : 'mdi-circle-outline'" />
                {{ req.label }}
              </li>
            </ul>
          </Transition>
        </div>

        <!-- Error -->
        <Transition name="err">
          <p v-if="error" class="error-msg" :key="error">
            <span class="mdi mdi-alert-circle-outline" /> {{ error }}
          </p>
        </Transition>

        <!-- Success -->
        <Transition name="err">
          <p v-if="success" class="success-msg">
            <span class="mdi mdi-check-circle-outline" /> Check your email to confirm your account
          </p>
        </Transition>

      </div>

      <div class="auth-footer">
        <UiButton
          class="w-full justify-center"
          :loading="authStore.loading"
          :disabled="!!password && strengthLevel < 2"
          @click="submit"
        >
          Sign up
        </UiButton>
        <button class="switch-btn" @click="authStore.openLogin">
          Already have an account? <span>Sign in</span>
        </button>
      </div>

    </div>
  </v-dialog>
</template>

<script setup lang="ts">
const authStore    = useAuthStore()
const email        = ref('')
const password     = ref('')
const error        = ref('')
const success      = ref(false)
const showPassword = ref(false)

const requirements = computed(() => [
  { label: 'At least 8 characters', met: password.value.length >= 8 },
  { label: 'One uppercase letter',  met: /[A-Z]/.test(password.value) },
  { label: 'One number (0–9)',       met: /[0-9]/.test(password.value) },
])

const strengthLevel = computed(() => {
  if (!password.value) return 0
  const met = requirements.value.filter(r => r.met).length
  if (met === 0) return 1
  if (met === 1) return 1
  if (met === 2) return 2
  return 3
})

const strengthColor = computed(() =>
  ['', '#ef4444', '#f59e0b', '#22c55e'][strengthLevel.value]
)

const strengthLabel = computed(() =>
  ['', 'Weak', 'Medium', 'Strong'][strengthLevel.value]
)

const emailTouched = ref(false)
const emailValid   = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))

async function submit() {
  emailTouched.value = true
  if (!emailValid.value) return
  error.value   = ''
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

.auth-title    { font-size: 0.9375rem; font-weight: 600; margin: 0; line-height: 1.2; }
.auth-subtitle { font-size: 0.8rem; color: var(--muted-foreground); margin: 3px 0 0; }

.auth-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.auth-footer { padding: 4px 24px 24px; display: flex; flex-direction: column; gap: 10px; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--foreground);
}

.strength-label {
  font-size: 0.7rem;
  font-weight: 600;
  transition: color 0.3s;
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

/* Strength bar */
.strength-bar {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.strength-seg {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: var(--border);
  transition: background 0.35s ease;
}

.strength-seg--active {
  transition: background 0.35s ease;
}

/* Requirements */
.req-list {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  transition: color 0.2s;
}

.req-item .mdi {
  font-size: 0.875rem;
  transition: color 0.2s;
  color: var(--border);
}

.req-item--met {
  color: #22c55e;
}

.req-item--met .mdi {
  color: #22c55e;
}

/* Messages */
.error-msg {
  font-size: 0.775rem;
  color: var(--destructive);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.success-msg {
  font-size: 0.775rem;
  color: #22c55e;
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

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-enter-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 120px;
}

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
