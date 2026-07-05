<template>
  <div
    class="min-h-screen bg-background text-foreground flex flex-col"
    style="font-family: var(--font-sans)"
  >
    <!-- Nav -->
    <nav
      class="flex items-center justify-between px-10 py-5 border-b border-border"
      style="animation: fade-up 0.4s ease both"
    >
      <span class="text-sm font-semibold tracking-tight">ReimagineImage</span>
      <button
        v-if="!authStore.user"
        class="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer bg-transparent border-none"
        @click="authStore.openLogin"
      >
        Sign in
      </button>
      <button
        v-else
        class="text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer bg-transparent border-none"
        @click="router.push({ name: 'editor' })"
      >
        Go to editor →
      </button>
    </nav>

    <!-- Hero -->
    <section
      class="flex-1 flex flex-col items-center justify-center text-center px-8 py-28 gap-8"
      style="animation: fade-up 0.5s 0.1s ease both"
    >
      <h1
        class="font-semibold tracking-[-0.03em] leading-[1.1] m-0 max-w-[560px]"
        style="font-size: clamp(2.4rem, 5vw, 3.6rem)"
      >
        Edit images.<br />Keep the original.
      </h1>

      <p class="text-[0.95rem] text-muted-foreground m-0 max-w-[380px] leading-relaxed">
        Crop, adjust and filter — non-destructive, real-time, entirely in your browser.
      </p>

      <button
        class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium border border-primary hover:opacity-90 transition-opacity cursor-pointer"
        style="border-radius: var(--radius)"
        @click="authStore.user ? router.push({ name: 'editor' }) : authStore.openRegister()"
      >
        {{ authStore.user ? 'Go to editor' : 'Get started free' }}
        <span class="mdi mdi-arrow-right text-[15px]" />
      </button>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border px-10 py-5 flex items-center justify-between">
      <span class="text-[0.72rem] font-medium">ReimagineImage</span>
      <span class="text-[0.72rem] text-muted-foreground">© {{ year }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()
const year = new Date().getFullYear()
</script>
