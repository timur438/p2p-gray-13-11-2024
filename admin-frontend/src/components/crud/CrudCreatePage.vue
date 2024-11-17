<template>
  <q-page class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-card flat bordered>

        <q-card-section>
          <div class="q-table__title q-mb-md">{{ title }}</div>

          <q-banner v-if="errors.length" class="bg-warning text-black" inline-actions dense rounded>
            <template v-slot:avatar>
              <q-icon name="warning"/>
            </template>
            <ul>
              <li v-for="err in errors" v-text="err"/>
            </ul>
          </q-banner>

          <component
              v-if="component"
              :is="component"/>
          <div v-else>NO FORM</div>

        </q-card-section>

        <q-card-actions align="right">
          <q-btn
              color="primary"
              label="Save"
              type="submit"
              :disable="ctx.loading.value"/>
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

<script lang="ts" setup>
  import {defineCrudCtx} from '@/components/crud/form.ts'
  import {computed, onMounted, PropType} from 'vue'
  import {useRouter} from 'vue-router'

  const props = defineProps({
    title: {type: String, required: true},
    urlPart: {type: String, required: true},
    component: {type: Object, required: false},
    initData: {type: Function as PropType<() => Record<any, any>>, required: true},
  })

  const router = useRouter()

  const ctx = defineCrudCtx({
    urlPart: props.urlPart,
    targetId: null,
    mode: 'create',
    initData: props.initData,
  })

  const errors = computed(() =>
      Object.entries(ctx.errors.value)
          .map(([k, v]) => `${k}: ${v}`),
  )

  async function onSubmit() {
    await ctx.submit()
    if (!ctx.hasErrors.value) {
      router.back()
    }
  }

  onMounted(async () => {
    await ctx.loadEntity()
  })
</script>
