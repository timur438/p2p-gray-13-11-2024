<template>
  <div class="row q-col-gutter-lg q-mb-lg">
    <div class="col-12 col-lg-4">
      <q-input
          v-model="data.app_id"
          label="App ID"/>
    </div>
    <div class="col-12 col-lg-4">
      <q-input
          v-model="data.amount"
          label="Amount"/>
    </div>
    <div class="col-12 col-lg-4">
      <q-input
          v-model="data.bank_account_id"
          label="Bank Account ID"/>
    </div>
    <div class="col-12 col-lg-4">
      <q-select
          v-model="data.status"
          label="Status"
          emit-value
          map-options
          :options="statusOptions"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useCrudCtx} from '@/components/crud/form.ts'

  const ctx = useCrudCtx()
  const data = ctx.data

  const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Paid', value: 1 },
    { label: 'Canceled', value: 2 },
  ]
</script>
