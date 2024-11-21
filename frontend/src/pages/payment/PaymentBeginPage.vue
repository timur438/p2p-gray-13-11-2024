<template>
  <div class="flex flex-col gap-3">
    <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
      Выберите способ оплаты
    </div>

    <div class="flex flex-wrap gap-3">
      <button class="btn-secondary w-full"
              @click="$router.push({name: 'payment.card', params: {id: $route.params.id}})">
        <i class="i-cards"/>
        Банковская карта
      </button>
      <button class="btn-secondary w-full"
              @click="$router.push({name: 'payment.phone', params: {id: $route.params.id}})">
        <img src="../../assets/img/sbp.svg" alt="" class="inline-block">
      </button>
    </div>
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
