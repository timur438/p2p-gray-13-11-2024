<template>
  <q-select
      v-model="value"
      :options="items"
      option-value="id"
      option-label="name"
      :loading="loading"
      input-debounce="300"
      :label="props.label"
      emit-value
      map-options>
    <template #selected-item="{opt}">
      <q-img :src="opt.image" width="1rem" height="1rem" class="q-mr-sm"/>
      {{ opt.name }}
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-img :src="scope.opt.image"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
  import {onMounted, ref} from 'vue'
  import {api} from '@/api.ts'

  const props = defineProps({
    label: {
      type: String,
      default: 'Select a Resource',
    },
  })

  const value = defineModel({
    type: String,
    default: '0',
  })

  const items = ref([])
  const loading = ref(false)

  async function loadItems() {

    loading.value = true

    const {data} = await api.get('resources', {params: {limit: 500}})
    items.value = data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: `/api/resource/${item.hash}`,
    }))

    loading.value = false
  }

  onMounted(() => loadItems())
</script>

<style scoped>
  /* Add any custom styles here */
</style>
