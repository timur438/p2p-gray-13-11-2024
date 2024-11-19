<template>
  <app-card-page v-if="loading && !invoice">
    <div class="flex items-center gap-3">
      <div class="text-[32px] font-medium text-white">{{ invoice!.amount }}₽</div>
      <div class="text-[16px] text-[rgba(255,255,255,0.35)]">К оплате</div>
      <div class="flex-grow"></div>
      <div v-if="invoice!.status === 1" class="text-[#21FF51]">Платёж принят</div>
      <div v-else-if="invoice!.status === 2" class="text-[#FF2121]">Платёж отклонён</div>
      <div v-else-if="isExpired" class="text-[#FF2121]">Платёж устарел</div>
      <div v-else-if="invoice!.status === 0 && !invoice!.user_approved_at">{{ countdown }}</div>
    </div>

    <template v-if="invoice!.number && !isExpired && invoice!.status === 0">

      <template v-if="!paymentType">
        <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
          Выберите способ оплаты
        </div>

        <div class="flex flex-wrap gap-3">
          <button class="btn-secondary w-full" @click="paymentType = 'card'">
            <i class="i-cards"/>
            Банковская карта
          </button>
          <button class="btn-secondary w-full" @click="paymentType = 'sbp'">
            <img src="../../assets/img/sbp.svg" alt="" class="inline-block">
          </button>
        </div>
      </template>

      <template v-else-if="invoice!.user_approved_at">
        <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
          Платеж в обработке! <br>
          Не закрывайте страницу
        </div>
      </template>

      <template v-else>
        <div class="bg-alert px-4 py-7 rounded-lg text-[#313131] text-[20px] leading-7 font-medium text-center">
          Переведите по указанным реквизитам
          ТОЧНУЮ сумму в течение 15 мин.
        </div>

        <div v-if="paymentType === 'card'" class="p-2 rounded-md bg-[#181818]">
          {{ invoice!.card_number }}
        </div>

        <div v-else-if="paymentType === 'sbp'" class="p-2 rounded-md bg-[#181818]">
          {{ invoice!.number }}
        </div>

        <div class="h-[1px] w-100 bg-white opacity-20"/>

        <div class="flex gap-3">
          <button class="btn-primary" @click="approveInvoice">Я оплатил</button>
          <button class="btn-secondary">Отмена
          </button>
        </div>

        <div>
          <a href="https://t.me/" target="_blank">Обратиться</a>
          в техническую поддержку
        </div>

      </template>

    </template>

  </app-card-page>
</template>

<script lang="ts" setup>
  import {useRoute} from 'vue-router'
  import {computed, ref} from 'vue'
  import {api} from '@/api.ts'
  import {IInvoiceData} from '@/types/IInvoiceData.ts'
  import {useIntervalFn, useTimestamp} from '@vueuse/core'
  import AppCardPage from '@/components/common/AppCardPage.vue'

  const route = useRoute()

  const paymentId = computed(() => route.params.id)
  const invoice = ref<IInvoiceData | null>(null)
  const loading = ref(true)
  const paymentType = ref<null | 'card' | 'sbp'>(null)

  async function loadInvoice() {
    loading.value = true

    const {data} = await api.get<IInvoiceData>(`/invoice/${paymentId.value}`)

    invoice.value = data
    loading.value = false
  }

  async function approveInvoice() {
    await api.post(`/invoice/${paymentId.value}/approve`)
    await loadInvoice()
  }

  useIntervalFn(loadInvoice, 1000, {immediateCallback: true})

  const timestamp = useTimestamp({immediate: true, interval: 1000})
  const isExpired = computed(() => delta.value <= 0)

  const delta = computed(() => {
    const inv = invoice.value
    if (!inv) {
      return 0
    }

    const expr = Date.parse(inv.expires_at)
    if (isNaN(expr)) {
      return 0
    }

    const diff = expr - timestamp.value
    return Math.max(0, diff)
  })

  const countdown = computed(() => {
    const ms = delta.value

    // mm:ss
    return Math.floor(ms / 1000 / 60) + ':' + Math.floor(ms / 1000 % 60).toString().padStart(2, '0')
  })

</script>
