<template>
  <v-dialog :model-value="true" max-width="960" @update:model-value="$emit('close')">
    <div
      style="
        background: var(--card);
        border-radius: var(--radius);
        overflow: hidden;
        display: flex;
        height: 560px;
      "
    >
      <!-- Left: image -->
      <div
        style="
          flex: 1;
          min-width: 0;
          background: var(--background);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 20px;
        "
      >
        <img
          :src="item.imageUrl"
          style="max-width: 100%; max-height: 100%; object-fit: contain; display: block"
        />
      </div>

      <!-- Divider -->
      <div style="width: 1px; flex-shrink: 0; background: var(--border)" />

      <!-- Right: JSON -->
      <div
        style="
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
          <p
            style="
              font-size: 0.7rem;
              font-weight: 600;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--muted-foreground);
              margin: 0;
            "
          >
            Preset
          </p>
          <div style="display: flex; gap: 2px">
            <UiIconButton
              icon="delete-outline"
              label="Delete"
              size="sm"
              variant="ghost"
              @click="confirmDelete = true"
            />
            <UiIconButton icon="close" label="Close" size="sm" @click="$emit('close')" />
          </div>
        </div>
        <div style="flex: 1; overflow: auto; padding: 16px 20px">
          <pre
            v-if="item.preset"
            style="
              font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
              font-size: 0.72rem;
              line-height: 1.6;
              color: var(--foreground);
              margin: 0;
              white-space: pre-wrap;
              word-break: break-all;
            "
            >{{ formatted }}</pre>
          <p v-else style="font-size: 0.78rem; color: var(--muted-foreground); margin: 0">
            No preset data.
          </p>
        </div>
      </div>
    </div>
  </v-dialog>

  <ConfirmModal
    v-if="confirmDelete"
    title="Delete image?"
    :message="`«${item.preset?.fileName ?? item.id}» will be permanently removed.`"
    @confirm="handleDelete"
    @cancel="confirmDelete = false"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ item: HistoryItem }>()
const emit = defineEmits<{ close: []; deleted: [] }>()

const store = useHistoryStore()
const confirmDelete = ref(false)

async function handleDelete() {
  confirmDelete.value = false
  await store.deleteItem(props.item.id)
  emit('deleted')
  emit('close')
}

const formatted = computed(() =>
  props.item.preset ? JSON.stringify(props.item.preset, null, 2) : '',
)
</script>
