<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view :key="route.name"/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
  import {useRoute} from 'vue-router'

  const route = useRoute()

</script>
