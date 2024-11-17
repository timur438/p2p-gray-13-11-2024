<template>
  <div class="row q-col-gutter-lg q-mb-lg">
    <div class="col-12 col-lg-4">
      <q-input
          v-model="data.name"
          label="Name"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useCrudCtx} from '@/components/crud/form.ts'

  const ctx = useCrudCtx()
  const data = ctx.data
</script>
