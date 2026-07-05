import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dirs: ['src/**/stores', 'src/composables'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dirs: ['src/components'],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
