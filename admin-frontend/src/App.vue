<template>
  <component
      v-if="initialized"
      :is="layoutComponent"/>
</template>

<script setup lang="ts">
  import {layoutComponent} from '@/services/layout.ts'
  import {initApplication} from '@/services/init.ts'
  import {onMounted, ref} from 'vue'

  const initialized = ref(false)

  async function init() {
    await initApplication()
    initialized.value = true
  }

  onMounted(init)
</script>
