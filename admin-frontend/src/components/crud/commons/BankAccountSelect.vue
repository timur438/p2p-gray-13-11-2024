<template>
  <q-select
      v-model="value"
      :options="items"
      option-value="id"
      option-label="number"
      :loading="loading"
      input-debounce="300"
      label="Select a Bank Account"
      emit-value
      map-options>
    <template #selected-item="{opt}">
      {{ opt.number }}
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.number }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
  import {onMounted, ref} from 'vue'
  import {api} from '@/api.ts'

  const value = ref(null)
  const items = ref([])
  const loading = ref(false)

  async function loadItems() {
    loading.value = true
    const {data} = await api.get('bank-accounts', {params: {limit: 500}})
    items.value = data.items.map((item: any) => ({
      id: item.id,
      number: item.number,
    }))
    loading.value = false
  }

  onMounted(() => loadItems())
</script>
