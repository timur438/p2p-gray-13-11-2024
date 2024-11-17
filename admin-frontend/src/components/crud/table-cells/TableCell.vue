<template>
  <q-td v-if="value !== null" :props="ctx">
    {{ value }}
  </q-td>
  <q-td v-else :props="ctx">
    <i class="text-grey">(null)</i>
  </q-td>
</template>

<script lang="ts" setup>
  import {computed} from 'vue'

  const props = defineProps({
    ctx: {
      type: Object,
      required: true,
    },
  })

  const value = computed(() => {
    const row = props.ctx.row
    const field = props.ctx.col.field
    const formatter = props.ctx.col.format
    const value = row[field]

    if (typeof field === 'function') {
      return field(row)
    }

    if (formatter) {
      return formatter(value, row)
    }

    return value
  })
</script>
