<template>
  <div class="flex flex-col gap-3">
    <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
      Переведите по указанным реквизитам
      ТОЧНУЮ сумму в течение 15 мин.
    </div>

    <div class="p-2 rounded-md bg-[#181818]">
      {{ formatCardNumber(invoice.card_number) }}
    </div>

    <div class="h-[1px] w-100 bg-white opacity-20"/>

    <div class="flex gap-3">
      <button class="btn-primary" @click="approve">Я оплатил</button>
      <button class="btn-secondary" @click="cancel">Отмена</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useRouter} from 'vue-router'
  import {formatCardNumber} from '@/util/format.ts'

  const props = defineProps({
    invoice: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits<{
    approve: [stage: 'card']
    cancel: []
  }>()

  const router = useRouter()

  async function approve() {
    emit('approve', 'card')
  }

  function cancel() {
    emit('cancel')
  }
</script>
