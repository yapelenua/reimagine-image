<template>
  <div style="display: flex; height: 100%;">

    <nav
      style="
        width: 52px;
        flex-shrink: 0;
        background: var(--card);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 0;
        gap: 4px;
      "
    >
      <UiTooltip v-for="item in navItems" :key="item.name" :text="item.label" location="right" :open-delay="200">
        <template #default="{ props: p }">
          <RouterLink :to="{ name: item.name }" custom v-slot="{ navigate }">
            <UiIconButton
              v-bind="p"
              :icon="item.icon"
              :label="item.label"
              :variant="route.name === item.name ? 'default' : 'ghost'"
              size="md"
              @click="navigate"
            />
          </RouterLink>
        </template>
      </UiTooltip>
    </nav>

    <div style="flex: 1; min-width: 0; overflow: hidden;">
      <slot />
    </div>

  </div>
</template>

<script setup lang="ts">

const route = useRoute()

const navItems = [
  { name: 'editor',  icon: 'image-edit-outline', label: 'Editor'  },
  { name: 'history', icon: 'history',             label: 'History' },
  { name: 'ui-kit',  icon: 'palette-outline',     label: 'UI Kit'  },
]
</script>
