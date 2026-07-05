<template>
  <v-dialog :model-value="true" max-width="540" @update:model-value="$emit('close')">
    <div
      style="
        background: var(--card);
        border-radius: var(--radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      "
    >
      <!-- Header -->
      <div
        style="
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <p style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); margin: 0">
          Preset
        </p>
        <UiIconButton icon="close" label="Close" size="sm" @click="$emit('close')" />
      </div>

      <div style="padding: 20px; display: flex; flex-direction: column; gap: 16px">
        <!-- Saved presets dropdown -->
        <div
          v-if="presetsStore.presets.length"
          style="display: flex; flex-direction: column; gap: 6px"
        >
          <p
            style="
              font-size: 0.7rem;
              font-weight: 600;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: var(--muted-foreground);
              margin: 0;
            "
          >
            Saved presets
          </p>
          <div style="display: flex; gap: 8px; align-items: center">
            <select
              v-model="selectedPresetId"
              style="
                flex: 1;
                background: var(--background);
                color: var(--foreground);
                border: 1px solid var(--border);
                border-radius: calc(var(--radius) * 0.75);
                padding: 6px 10px;
                font-size: 0.8rem;
                outline: none;
                cursor: pointer;
              "
              @change="loadSelectedPreset"
            >
              <option value="" disabled>Select a preset…</option>
              <option v-for="p in presetsStore.presets" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
            <UiIconButton
              v-if="selectedPresetId"
              icon="delete-outline"
              label="Delete preset"
              size="sm"
              variant="ghost"
              @click="confirmDelete = true"
            />
          </div>
        </div>

        <!-- Divider if presets exist -->
        <div v-if="presetsStore.presets.length" style="height: 1px; background: var(--border)" />

        <!-- JSON textarea -->
        <div style="display: flex; flex-direction: column; gap: 6px">
          <p
            style="
              font-size: 0.7rem;
              font-weight: 600;
              letter-spacing: 0.06em;
              text-transform: uppercase;
              color: var(--muted-foreground);
              margin: 0;
            "
          >
            JSON
          </p>
          <textarea
            v-model="raw"
            placeholder='{ "adjustments": { "brightness": 110, "contrast": 95, "saturation": 120 }, "filter": "none" }'
            style="
              width: 100%;
              height: 160px;
              background: var(--background);
              color: var(--foreground);
              border: 1px solid var(--border);
              border-radius: calc(var(--radius) * 0.75);
              padding: 10px 12px;
              font-family: 'JetBrains Mono', 'Fira Code', monospace;
              font-size: 0.72rem;
              line-height: 1.6;
              resize: vertical;
              outline: none;
              box-sizing: border-box;
            "
            spellcheck="false"
            @focus="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--primary)'"
            @blur="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'"
          />
          <p v-if="applyError" style="font-size: 0.75rem; color: var(--destructive); margin: 0">
            <span class="mdi mdi-alert-circle-outline mr-1" />{{ applyError }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        style="
          padding: 12px 20px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        "
      >
        <UiButton variant="secondary" size="sm" @click="$emit('close')">Cancel</UiButton>
        <UiButton size="sm" :disabled="!raw.trim()" @click="handleApply">Apply</UiButton>
      </div>
    </div>
  </v-dialog>

  <ConfirmModal
    v-if="confirmDelete && selectedPresetId"
    title="Delete preset?"
    :message="`«${presetsStore.presets.find(p => p.id === selectedPresetId)?.name}» will be permanently removed.`"
    @confirm="handleDeleteSelected"
    @cancel="confirmDelete = false"
  />
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const imageStore = useImageStore()
const presetsStore = usePresetsStore()

const raw = ref('')
const selectedPresetId = ref('')
const applyError = ref<string | null>(null)
const confirmDelete = ref(false)

onMounted(() => {
  presetsStore.fetchPresets()
})

function loadSelectedPreset() {
  const found = presetsStore.presets.find(p => p.id === selectedPresetId.value)
  if (found) raw.value = JSON.stringify(found.preset, null, 2)
}

async function handleDeleteSelected() {
  confirmDelete.value = false
  await presetsStore.deletePreset(selectedPresetId.value)
  selectedPresetId.value = ''
  raw.value = ''
}

async function handleApply() {
  applyError.value = await imageStore.applyPreset(raw.value)
  if (!applyError.value) emit('close')
}
</script>
