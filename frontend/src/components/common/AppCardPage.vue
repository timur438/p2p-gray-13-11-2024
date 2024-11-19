<template>
  <div class="flex items-center justify-center h-[100vh]">
    <app-spinner v-if="loading"/>
    <div
        v-else
        class="flex flex-col gap-[13px] w-[430px] p-[26px_18px] rounded-[12px] shadow-[0_2px_17.5px_0_rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] bg-[#0e0e0e]">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import AppSpinner from '@/components/common/AppSpinner.vue'

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  })
</script>
