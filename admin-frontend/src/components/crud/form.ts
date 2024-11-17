import {computed, inject, provide, ref} from 'vue'
import {api} from '@/api.ts'
import {extractErrorMessages} from '@/components/crud/util.ts'

function createCrudCtx(params: {
  urlPart: string
  targetId: null | string
  mode: 'edit' | 'create'
  initData?: () => Record<string, any>
}) {
  const urlPart = params.urlPart
  const targetId = params.targetId
  const mode = params.mode
  const entity = ref<null | Record<string, any>>(null)
  const data = ref<Record<string, any>>({})
  const errors = ref<Record<string, any>>({})
  const loading = ref<boolean>(false)

  const hasErrors = computed(() => Object.keys(errors.value).length > 0)

  if (mode === 'create') {
    data.value = params.initData ? params.initData() : {}
  }

  async function loadEntity() {
    if (mode === 'edit' && !targetId) {
      throw new Error('Target id is required for edit mode')
    }

    if (mode === 'create') {
      data.value = params.initData ? params.initData() : {}
      return
    }

    errors.value = {}

    try {
      const resp = await api.get(`${urlPart}/${targetId}`)
      entity.value = resp.data

      resetData()

    } catch (e: any) {
      errors.value = e?.response?.data ?? {'_root': e.message}
    }
  }

  function resetData() {
    if (mode === 'create' || targetId !== null) {
      data.value = entity.value ?? {}
    } else {
      data.value = {}
    }

    errors.value = {}
  }

  async function submit() {
    loading.value = true
    errors.value = {}

    try {
      if (mode === 'create') {
        await api.post(`${urlPart}`, data.value)
      } else {
        await api.post(`${urlPart}/${targetId}`, data.value)
      }
    } catch (e: any) {
      errors.value = extractErrorMessages(e)
    }

    loading.value = false
  }

  return {
    entity,
    data,
    errors,
    loading,
    hasErrors,
    loadEntity,
    resetData,
    submit,
  }
}

type ICrudCtx = ReturnType<typeof createCrudCtx>
type ICrudParams = Parameters<typeof createCrudCtx>[0]

export function defineCrudCtx(params: ICrudParams) {
  const ctx = createCrudCtx(params)

  provide('crud', ctx)

  return ctx
}

export function useCrudCtx(): ICrudCtx {
  const crud = inject('crud') as ICrudCtx | undefined

  if (!crud) {
    throw new Error('Crud context not found')
  }

  return crud
}
