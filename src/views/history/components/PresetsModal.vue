<template>
  <v-dialog :model-value="true" max-width="640" @update:model-value="$emit('close')">
    <div
      style="
        background: var(--card);
        border-radius: var(--radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        max-height: 80vh;
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
          flex-shrink: 0;
        "
      >
        <p style="font-size: 0.875rem; font-weight: 600; color: var(--foreground); margin: 0">
          Saved Presets
        </p>
        <UiIconButton icon="close" label="Close" size="sm" @click="$emit('close')" />
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto">
        <!-- Add preset form -->
        <div
          style="
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            gap: 10px;
          "
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
            Add preset
          </p>
          <input
            v-model="newName"
            placeholder="Name…"
            style="
              width: 100%;
              background: var(--background);
              color: var(--foreground);
              border: 1px solid var(--border);
              border-radius: calc(var(--radius) * 0.75);
              padding: 7px 11px;
              font-size: 0.825rem;
              outline: none;
              box-sizing: border-box;
            "
            @focus="($event.target as HTMLInputElement).style.borderColor = 'var(--primary)'"
            @blur="($event.target as HTMLInputElement).style.borderColor = 'var(--border)'"
          />
          <textarea
            v-model="newJson"
            placeholder='{ "adjustments": { "brightness": 110, "contrast": 100, "saturation": 120 }, "filter": "none" }'
            style="
              width: 100%;
              height: 90px;
              background: var(--background);
              color: var(--foreground);
              border: 1px solid var(--border);
              border-radius: calc(var(--radius) * 0.75);
              padding: 7px 11px;
              font-family: 'JetBrains Mono', 'Fira Code', monospace;
              font-size: 0.72rem;
              line-height: 1.6;
              resize: none;
              outline: none;
              box-sizing: border-box;
            "
            spellcheck="false"
            @focus="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--primary)'"
            @blur="($event.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'"
          />
          <p v-if="addError" style="font-size: 0.75rem; color: var(--destructive); margin: 0">
            <span class="mdi mdi-alert-circle-outline mr-1" />{{ addError }}
          </p>
          <div style="display: flex; justify-content: flex-end">
            <UiButton
              size="sm"
              :loading="adding"
              :disabled="!newName.trim() || !newJson.trim()"
              @click="handleAdd"
            >
              <span class="mdi mdi-plus mr-1" />Add
            </UiButton>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" style="display: flex; justify-content: center; padding: 40px">
          <v-progress-circular indeterminate color="primary" size="28" />
        </div>

        <!-- Empty -->
        <div
          v-else-if="!store.presets.length"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            padding: 40px 20px;
          "
        >
          <span
            class="mdi mdi-bookmark-off-outline"
            style="font-size: 2rem; color: var(--muted-foreground)"
          />
          <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0">
            No saved presets yet.
          </p>
        </div>

        <!-- List -->
        <div v-else>
          <div
            v-for="preset in store.presets"
            :key="preset.id"
            style="border-bottom: 1px solid var(--border)"
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 20px;
                cursor: pointer;
              "
              @click="expanded = expanded === preset.id ? null : preset.id"
            >
              <div style="display: flex; flex-direction: column; gap: 2px">
                <p
                  style="font-size: 0.825rem; font-weight: 500; color: var(--foreground); margin: 0"
                >
                  {{ preset.name }}
                </p>
                <p style="font-size: 0.7rem; color: var(--muted-foreground); margin: 0">
                  {{ formatDate(preset.created_at) }}
                </p>
              </div>
              <div style="display: flex; align-items: center; gap: 4px">
                <UiIconButton
                  icon="delete-outline"
                  label="Delete"
                  size="sm"
                  variant="ghost"
                  :disabled="deleting === preset.id"
                  @click.stop="confirmDeleteId = preset.id"
                />
                <span
                  class="mdi"
                  :class="expanded === preset.id ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  style="color: var(--muted-foreground); font-size: 1.1rem"
                />
              </div>
            </div>

            <div v-if="expanded === preset.id" style="padding: 0 20px 16px">
              <pre
                style="
                  background: var(--background);
                  border: 1px solid var(--border);
                  border-radius: calc(var(--radius) * 0.75);
                  padding: 12px 14px;
                  font-family: 'JetBrains Mono', 'Fira Code', monospace;
                  font-size: 0.72rem;
                  line-height: 1.6;
                  color: var(--foreground);
                  margin: 0;
                  white-space: pre-wrap;
                  word-break: break-all;
                  overflow: auto;
                  max-height: 200px;
                "
                >{{ JSON.stringify(preset.preset, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>

  <ConfirmModal
    v-if="confirmDeleteId"
    title="Delete preset?"
    :message="`«${store.presets.find(p => p.id === confirmDeleteId)?.name}» will be permanently removed.`"
    @confirm="
      handleDelete(confirmDeleteId!)
      confirmDeleteId = null
    "
    @cancel="confirmDeleteId = null"
  />
</template>

<script setup lang="ts">
defineEmits<{ close: [] }>()

const store = usePresetsStore()
const expanded = ref<string | null>(null)
const deleting = ref<string | null>(null)
const confirmDeleteId = ref<string | null>(null)

const newName = ref('')
const newJson = ref('')
const adding = ref(false)
const addError = ref<string | null>(null)

onMounted(() => store.fetchPresets())

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function handleAdd() {
  addError.value = null
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(newJson.value)
  } catch {
    addError.value = 'Invalid JSON'
    return
  }
  adding.value = true
  try {
    await store.savePreset(newName.value.trim(), parsed)
    newName.value = ''
    newJson.value = ''
  } catch (e) {
    addError.value = (e as Error).message
  } finally {
    adding.value = false
  }
}

async function handleDelete(id: string) {
  deleting.value = id
  try {
    await store.deletePreset(id)
  } finally {
    deleting.value = null
  }
}
</script>
