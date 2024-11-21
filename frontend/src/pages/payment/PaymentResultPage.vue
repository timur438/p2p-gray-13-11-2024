<template>
  <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
    <template v-if="invoice.status === 1">
      Платёж успешно выполнен
    </template>
    <template v-else-if="invoice.status === 2">
      Платёж отклонён
    </template>
    <template v-else>
      Платёж устарел
    </template>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    invoice: {
      type: Object,
      required: true,
    },
  })
</script>
