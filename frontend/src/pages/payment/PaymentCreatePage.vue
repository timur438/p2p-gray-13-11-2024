<template>
  <div class="flex items-center justify-center h-[100vh]">
    <div
        class="flex flex-col gap-[13px] w-[430px] p-[26px_18px] rounded-[12px] shadow-[0_2px_17.5px_0_rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] bg-[#0e0e0e]">
      <div class="flex flex-col gap-3">
        <input type="number" v-model="price" placeholder="Цена" class="form-input">
        <button class="btn-primary" @click="createPayment">Создать платеж</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {api} from '@/api.ts'

  const price = ref(0)

  async function createPayment() {
    const {data} = await api.post<{ url: string }>('invoice/new', {price: price.value})
    location.href = data.url
  }
</script>
