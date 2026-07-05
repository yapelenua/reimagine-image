<template>
  <div style="padding: 32px; min-height: 100%;">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 style="font-size: 1.1rem; font-weight: 600; color: var(--foreground); margin: 0;">History</h1>
      <div style="display: flex; gap: 8px;">
        <UiButton variant="secondary" size="sm" @click="presetsModal = true">
          <span class="mdi mdi-bookmark-outline mr-1" />Presets
        </UiButton>
        <UiButton variant="secondary" size="sm" :loading="store.loading" @click="store.fetchHistory()">
          <span class="mdi mdi-refresh mr-1" />Refresh
        </UiButton>
      </div>
    </div>

    <!-- Not logged in -->
    <div v-if="!authStore.user" class="flex flex-col items-center justify-center gap-4" style="height: 240px;">
      <span class="mdi mdi-lock-outline" style="font-size: 2.5rem; color: var(--muted-foreground);" />
      <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">Sign in to view your saved images.</p>
    </div>

    <!-- Loading -->
    <div v-else-if="store.loading && !store.items.length" class="flex items-center justify-center" style="height: 240px;">
      <v-progress-circular indeterminate color="primary" size="32" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="flex flex-col items-center justify-center gap-3" style="height: 240px;">
      <span class="mdi mdi-alert-circle-outline" style="font-size: 2rem; color: var(--destructive);" />
      <p style="font-size: 0.875rem; color: var(--destructive); margin: 0;">{{ store.error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center gap-4" style="height: 240px;">
      <span class="mdi mdi-image-off-outline" style="font-size: 2.5rem; color: var(--muted-foreground);" />
      <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">No saved images yet.</p>
    </div>

    <!-- Grid -->
    <div
      v-else
      style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;"
    >
      <div
        v-for="item in store.items"
        :key="item.id"
        style="
          cursor: pointer;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color 0.15s;
        "
        @click="selected = item"
        @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'"
        @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = 'var(--border)'"
      >
        <div style="aspect-ratio: 1; overflow: hidden; background: var(--background);">
          <img
            :src="item.imageUrl"
            style="width: 100%; height: 100%; object-fit: cover; display: block;"
          />
        </div>
        <div style="padding: 8px 12px;">
          <p
            class="truncate"
            style="font-size: 0.72rem; color: var(--muted-foreground); margin: 0;"
          >{{ item.preset?.fileName ?? item.id }}</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <HistoryModal  v-if="selected"     :item="selected" @close="selected = null" @deleted="selected = null" />
    <PresetsModal  v-if="presetsModal" @close="presetsModal = false" />

  </div>
</template>

<script setup lang="ts">
import HistoryModal from './components/HistoryModal.vue'
import PresetsModal from './components/PresetsModal.vue'

const store        = useHistoryStore()
const authStore    = useAuthStore()
const selected     = ref<HistoryItem | null>(null)
const presetsModal = ref(false)

onMounted(() => { if (authStore.user) store.fetchHistory() })
watch(() => authStore.user, (u) => { if (u) store.fetchHistory() })
</script>
