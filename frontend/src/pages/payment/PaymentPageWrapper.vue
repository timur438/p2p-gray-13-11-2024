<template>
  <div class="flex items-center justify-center h-[100vh]">
    <app-spinner v-if="loading && !invoice"/>
    <div v-else-if="invoice"
         class="flex flex-col w-[430px] p-[26px_18px] rounded-[12px] shadow-[0_2px_17.5px_0_rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] bg-[#0e0e0e]">
      <div class="leading-none -mb-1 text-xs">ID: {{ invoice.id }}</div>
      <div class="flex items-center gap-3 mb-3">
        <div class="text-[32px] font-medium text-white">{{ formatMoney(invoice?.amount) }}</div>
        <div class="text-[16px] text-[rgba(255,255,255,0.35)]">К оплате</div>
        <div class="flex-grow"></div>
        <div v-if="invoice.status === 1" class="text-[#21FF51]">Платёж принят</div>
        <div v-else-if="invoice.status === 2" class="text-[#FF2121]">Платёж отклонён</div>
        <div v-else-if="isExpired" class="text-[#FF2121]">Платёж устарел</div>
        <div v-else-if="invoice.status === 0 && !invoice.user_approved_at">{{ countdown }}</div>
      </div>

      <router-view
          v-if="invoice"
          :invoice="invoice"
          @approve="handleApprove"
          @cancel="handleCancel"/>

      <div class="mt-3">
        <a href="https://t.me/" target="_blank">Обратиться</a>
        в техническую поддержку
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useRoute, useRouter} from 'vue-router'
  import {computed, Ref, ref, watch} from 'vue'
  import {api} from '@/api.ts'
  import {IInvoiceData} from '@/types/IInvoiceData.ts'
  import {useIntervalFn, useTimestamp} from '@vueuse/core'
  import AppSpinner from '@/components/common/AppSpinner.vue'
  import {formatMoney} from '@/util/format.ts'

  const route = useRoute()
  const router = useRouter()

  const paymentId = computed(() => route.params.id)
  const invoice = ref(null) as Ref<IInvoiceData | null>
  const loading = ref(true)

  async function loadInvoice() {
    loading.value = true
    const {data} = await api.get<IInvoiceData>(`/invoice/${paymentId.value}`)
    invoice.value = data
    loading.value = false
  }

  useIntervalFn(loadInvoice, 1000, {immediateCallback: true})

  const timestamp = useTimestamp({immediate: true, interval: 1000})
  const isExpired = computed(() => delta.value <= 0)

  const delta = computed(() => {
    const inv = invoice.value
    if (!inv) return 0
    const expr = Date.parse(inv.expires_at)
    return isNaN(expr) ? 0 : Math.max(0, expr - timestamp.value)
  })

  const countdown = computed(() => {
    const ms = delta.value
    return Math.floor(ms / 1000 / 60) + ':' + Math.floor(ms / 1000 % 60).toString().padStart(2, '0')
  })

  async function handleApprove(stage: 'card' | 'phone') {
    await api.post(`/invoice/${route.params.id}/approve`, {stage})
    await loadInvoice()
    await router.push({name: 'payment.wait', params: {id: route.params.id}})
  }

  function handleCancel() {
    router.push({name: 'payment.begin', params: {id: route.params.id}})
  }

  watch([
    () => invoice.value !== null,
    () => invoice.value?.status,
    isExpired,
  ], ([loaded, status, expired]) => {
    if (!loaded) {
      return
    }

    if (status === 1 || status === 2 || expired) {
      router.push({name: 'payment.result', params: {id: route.params.id}})
    }
  }, {immediate: true})
</script>
