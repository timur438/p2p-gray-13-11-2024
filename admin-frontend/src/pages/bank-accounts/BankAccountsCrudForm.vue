<template>
  <div class="row q-col-gutter-lg q-mb-lg">
    <div class="col-12 col-lg-4">
      <q-select
          v-model="data.type"
          label="Type"
          emit-value
          map-options
          :options="[{ label: 'Ozon', value: 'ozon' }]"/>
    </div>

    <div class="col-12 col-lg-4">
      <q-input
          v-model="data.number"
          label="Phone number"
          hint="В интернациональном формате без пробелов и скобок"/>
    </div>
  </div>

  <div v-if="data.proxy" class="row q-col-gutter-lg q-mb-lg">
    <div class="col-12 col-lg-3">
      <q-input
          v-model="data.proxy.ip"
          label="Proxy IP"/>
    </div>

    <div class="col-12 col-lg-3">
      <q-input
          v-model="data.proxy.port"
          label="Proxy Port"/>
    </div>

    <div class="col-12 col-lg-3">
      <q-input
          v-model="data.proxy.login"
          label="Proxy Login"/>
    </div>

    <div class="col-12 col-lg-3">
      <q-input
          v-model="data.proxy.password"
          label="Proxy Password"/>
    </div>
  </div>

  <div v-if="data.type === 'ozon'" class="row q-col-gutter-lg">
    <div class="col-12">
      Cookies
    </div>
    <div class="col-12 col-lg-6">
      <q-input
          v-model="ozonCookies.finance.value"
          label="Finance domain Cookies"/>
      <div class="text-caption q-mt-xs">
        To get cookies, run: <code>document.cookie</code> in the browser console on this domain:
        https://finance.ozon.ru/
      </div>
    </div>
    <div class="col-12 col-lg-6">
      <q-input
          v-model="ozonCookies.finance.value"
          label="Ozon Cookies"/>
      <div class="text-caption q-mt-xs">
        To get cookies, run: <code>document.cookie</code> in the browser console on this domain: https://ozon.ru/
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
  import {useCrudCtx} from '@/components/crud/form.ts'
  import {computed} from 'vue'

  const ctx = useCrudCtx()
  const data = ctx.data

  function safeStringCookies(domain: string) {
    return computed<string>({
      set(val: string) {
        data.value.cookies ??= {}
        data.value.cookies[domain] = [val]
      },
      get() {
        return data.value.cookies?.[domain]?.[0] ?? ''
      },
    })
  }

  const ozonCookies = {
    finance: safeStringCookies('https://finance.ozon.ru/'),
    ozon: safeStringCookies('https://ozon.ru/'),
  }
</script>
