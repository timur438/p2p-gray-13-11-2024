<template>
  <a :href="resourceUrl" target="_blank">
    <div class="img"/>
  </a>
</template>

<script lang="ts" setup>

  import {computed, useCssVars} from 'vue'

  const props = defineProps({
    ctx: {
      type: Object,
      required: true,
    },
    dataField: {
      type: String,
      required: true,
    },
    mimeField: {
      type: String,
      optional: true,
    },
  })

  const rowData = computed(() => props.ctx.row)
  const mime = computed(() => props.mimeField ? rowData.value[props.mimeField] : '')
  const isImage = computed(() => !mime.value || mime.value.startsWith('image/'))
  const resourceUrl = computed(() => '/api/resource/' + rowData.value[props.dataField])

  useCssVars(() => ({
    'image': isImage.value ? `url(${resourceUrl.value})` : 'none',
  }))

</script>

<style lang="scss" scoped>
  .img {
    width: 100px;
    height: 100px;

    border-radius: 10px;
    background-image: var(--image);
    background-size: cover;
    border: 1px solid #333;
  }
</style>
