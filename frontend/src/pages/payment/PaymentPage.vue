<template>
  <div class="flex items-center justify-center h-[100vh]">
    <app-spinner v-if="loading && invoice"/>

    <div v-else
         class="flex flex-col gap-[13px] w-[430px] p-[26px_18px] rounded-[12px] shadow-[0_2px_17.5px_0_rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] bg-[#0e0e0e]">

      <div class="flex items-center gap-3">
        <div class="text-[32px] font-medium text-white">{{ invoice!.amount }}₽</div>
        <div class="text-[16px] text-[rgba(255,255,255,0.35)]">К оплате</div>
        <div class="flex-grow"></div>
        <div class="">{{ countdown }}</div>
      </div>

      <template v-if="invoice!.number">

        <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
          Переведите по указанным реквизитам
          ТОЧНУЮ сумму в течение 15 мин.
        </div>

        <div class="p-2 rounded-md bg-[#181818]">
          {{ invoice!.number }}
        </div>

        <div class="h-[1px] w-100 bg-white opacity-20"/>

        <div class="flex gap-3">
          <button class="py-2 px-3 flex-grow rounded-md bg-[#ff8f1e]">Я оплатил</button>
          <button class="py-2 px-3 flex-grow rounded-md border border-[rgba(255,255,255,0.08)] bg-[#121212]">Отмена</button>
        </div>

        <div>
          <a href="https://t.me/" target="_blank">Обратиться</a>
          в техническую поддержку
        </div>

      </template>

    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useRoute} from 'vue-router'
  import AppSpinner from '@/components/common/AppSpinner.vue'
  import {computed, ref, watch} from 'vue'
  import {api} from '@/api.ts'
  import {IInvoiceData} from '@/types/IInvoiceData.ts'
  import {useTimestamp} from '@vueuse/core'

  const route = useRoute()

  const paymentId = computed(() => route.params.id)
  const invoice = ref<IInvoiceData | null>(null)
  const loading = ref(true)

  async function loadInvoice() {
    loading.value = true

    const {data} = await api.get<IInvoiceData>(`/invoice/${paymentId.value}`)

    invoice.value = data
    loading.value = false
  }

  watch(paymentId, loadInvoice, {immediate: true})

  const timestamp = useTimestamp({immediate: true, interval: 1000})
  const countdown = computed(() => {
    const inv = invoice.value
    if (!inv) {
      return 0
    }

    const expr = Date.parse(inv.expires_at)
    if (isNaN(expr)) {
      return 0
    }

    const diff = expr - timestamp.value
    const ms = Math.max(0, diff)

    // mm:ss
    return Math.floor(ms / 1000 / 60) + ':' + Math.floor(ms / 1000 % 60).toString().padStart(2, '0')
  })

</script>
