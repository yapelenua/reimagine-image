<template>
  <v-dialog :model-value="true" max-width="360" @update:model-value="$emit('close')">
    <div
      style="
        background: var(--card);
        border-radius: var(--radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      "
    >
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
          Save Preset
        </p>
        <UiIconButton icon="close" label="Close" size="sm" @click="$emit('close')" />
      </div>

      <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px">
        <input
          ref="inputRef"
          v-model="name"
          placeholder="Preset name…"
          style="
            width: 100%;
            background: var(--background);
            color: var(--foreground);
            border: 1px solid var(--border);
            border-radius: calc(var(--radius) * 0.75);
            padding: 8px 12px;
            font-size: 0.875rem;
            outline: none;
            box-sizing: border-box;
          "
          @focus="($event.target as HTMLInputElement).style.borderColor = 'var(--primary)'"
          @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--border)'"
          @keydown.enter="handleSave"
        />
        <p v-if="error" style="font-size: 0.75rem; color: var(--destructive); margin: 0">
          {{ error }}
        </p>
      </div>

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
        <UiButton size="sm" :loading="saving" :disabled="!name.trim()" @click="handleSave"
          >Save</UiButton
        >
      </div>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ close: [] }>()

const imageStore = useImageStore()
const presetsStore = usePresetsStore()

const name = ref('')
const saving = ref(false)
const error = ref<string | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => inputRef.value?.focus())

async function handleSave() {
  if (!name.value.trim()) return
  saving.value = true
  error.value = null
  try {
    await presetsStore.savePreset(name.value.trim(), {
      crop: imageStore.cropData,
      adjustments: imageStore.adjustments,
      filter: imageStore.activeFilter,
    })
    emit('close')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    saving.value = false
  }
}
</script>
