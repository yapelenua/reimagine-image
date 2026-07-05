<template>
  <div class="max-w-[860px] mx-auto px-8 py-12">

    <div class="mb-12 pb-6 border-b border-border">
      <h1 class="text-[1.75rem] font-semibold tracking-[-0.02em] text-foreground mb-1">UI Kit</h1>
      <p class="text-sm text-muted-foreground">Component library — Indigo Mono</p>
    </div>

    <div class="flex flex-col gap-10">

      <!-- BUTTONS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Button</h2>

        <div class="flex flex-col gap-2.5">
          <p class="text-xs font-medium text-muted-foreground">Variants</p>
          <div class="flex flex-wrap items-center gap-2.5">
            <UiButton variant="primary">Primary</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
            <UiButton variant="destructive">Destructive</UiButton>
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <p class="text-xs font-medium text-muted-foreground">Sizes</p>
          <div class="flex flex-wrap items-baseline gap-2.5">
            <UiButton size="sm">Small</UiButton>
            <UiButton size="md">Medium</UiButton>
            <UiButton size="lg">Large</UiButton>
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <p class="text-xs font-medium text-muted-foreground">States</p>
          <div class="flex flex-wrap items-center gap-2.5">
            <UiButton :loading="true">Loading</UiButton>
            <UiButton :disabled="true">Disabled</UiButton>
          </div>
        </div>
      </section>

      <UiDivider />

      <!-- ICON BUTTONS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Icon Button</h2>

        <div class="flex flex-col gap-2.5">
          <p class="text-xs font-medium text-muted-foreground">Variants</p>
          <div class="flex flex-wrap items-center gap-2.5">
            <UiIconButton icon="download" label="Download" variant="ghost" />
            <UiIconButton icon="restore" label="Reset" variant="default" />
            <UiIconButton icon="delete" label="Delete" variant="destructive" />
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <p class="text-xs font-medium text-muted-foreground">Sizes</p>
          <div class="flex flex-wrap items-baseline gap-2.5">
            <UiIconButton icon="crop" label="Crop" size="sm" />
            <UiIconButton icon="crop" label="Crop" size="md" />
            <UiIconButton icon="crop" label="Crop" size="lg" />
          </div>
        </div>
      </section>

      <UiDivider />

      <!-- CHIPS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Chip</h2>
        <div class="flex flex-wrap gap-2">
          <UiChip v-model="chips.none" icon="image-filter-none">None</UiChip>
          <UiChip v-model="chips.greyscale" icon="contrast-box">Greyscale</UiChip>
          <UiChip v-model="chips.sepia" icon="palette">Sepia</UiChip>
          <UiChip v-model="chips.invert" icon="invert-colors">Invert</UiChip>
        </div>
      </section>

      <UiDivider />

      <!-- SLIDERS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Slider</h2>
        <div class="flex flex-col gap-4 max-w-xs">
          <UiSlider v-model="sliders.brightness" label="Brightness" :min="0" :max="200" unit="%" />
          <UiSlider v-model="sliders.contrast"   label="Contrast"   :min="0" :max="200" unit="%" />
          <UiSlider v-model="sliders.saturation" label="Saturation" :min="0" :max="200" unit="%" />
        </div>
        <div class="max-w-xs">
          <p class="text-xs font-medium text-muted-foreground mb-2.5">Disabled</p>
          <UiSlider v-model="sliders.brightness" label="Brightness" :min="0" :max="200" :disabled="true" />
        </div>
      </section>

      <UiDivider />

      <!-- CARDS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Card</h2>
        <div class="flex flex-wrap items-stretch gap-4">
          <div class="w-[220px]">
            <UiCard>
              <template #header>Default card</template>
              Card body content goes here.
              <template #footer>
                <UiButton size="sm" variant="ghost">Action</UiButton>
              </template>
            </UiCard>
          </div>
          <div class="w-[220px]">
            <UiCard hoverable>
              <template #header>Hoverable</template>
              Hover to see transition.
            </UiCard>
          </div>
          <div class="w-[220px]">
            <UiCard flat>
              <template #header>Flat</template>
              No border, transparent bg.
            </UiCard>
          </div>
        </div>
      </section>

      <UiDivider />

      <!-- DIVIDERS -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Divider</h2>
        <div class="flex flex-col gap-4">
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-2.5">Horizontal</p>
            <UiDivider />
          </div>
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-2.5">With label</p>
            <UiDivider label="Adjustments" />
          </div>
          <div>
            <p class="text-xs font-medium text-muted-foreground mb-2.5">Vertical</p>
            <div class="flex items-stretch h-10 gap-4">
              <span class="flex items-center text-sm text-muted-foreground">Left</span>
              <UiDivider orientation="vertical" />
              <span class="flex items-center text-sm text-muted-foreground">Right</span>
            </div>
          </div>
        </div>
      </section>

      <UiDivider />

      <!-- TOOLTIP -->
      <section class="flex flex-col gap-5">
        <h2 class="text-[0.7rem] font-semibold tracking-[0.08em] uppercase text-muted-foreground">Tooltip</h2>
        <div class="flex flex-wrap gap-3">
          <UiTooltip text="Downloads the result image" location="top">
            <template #default="{ props }">
              <UiButton v-bind="props" variant="secondary">
                <span class="mdi mdi-download" /> Download
              </UiButton>
            </template>
          </UiTooltip>
          <UiTooltip text="Reset all edits to original" location="bottom">
            <template #default="{ props }">
              <UiIconButton v-bind="props" icon="restore" label="Reset" variant="default" />
            </template>
          </UiTooltip>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiDivider from '@/components/ui/UiDivider.vue'
import UiChip from '@/components/ui/UiChip.vue'
import UiSlider from '@/components/ui/UiSlider.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'

const chips = reactive({ none: true, greyscale: false, sepia: false, invert: false })
const sliders = reactive({ brightness: 100, contrast: 100, saturation: 100 })
</script>
