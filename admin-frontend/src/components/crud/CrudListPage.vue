<template>
  <q-page class="q-pa-md">
    <q-table
        flat bordered
        ref="tableRef"
        :title="title"
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="perPageOptions"
        row-key="id"
        v-model:pagination="pagination"
        :loading="loading"
        :filter="filter"
        binary-state-sort
        @request="onRequest">

      <template #top-right>
        <q-input v-if="search" borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template #append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <div v-if="createRoute" class="q-pl-lg">
          <q-btn outline rounded color="primary" icon="add" label="Create" :to="createRoute"/>
        </div>
      </template>

      <template #body-cell="ctx">
        <q-td v-if="ctx.col.component" :props="ctx">
          <component :is="ctx.col.component" v-bind="{ctx, ...(ctx.col.props ?? {})}"/>
        </q-td>
        <table-cell v-else :ctx="ctx"/>

        <q-menu touch-position context-menu>
          <q-list>

            <q-item v-if="editRoute" clickable v-ripple @click="onEdit(ctx.row)">
              <q-item-section avatar>
                <q-icon name="edit"/>
              </q-item-section>
              <q-item-section>Edit</q-item-section>
            </q-item>

            <q-item v-if="hasDelete" clickable v-ripple @click="onDelete(ctx.row)">
              <q-item-section avatar>
                <q-icon name="delete"/>
              </q-item-section>
              <q-item-section>Delete</q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </template>

    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
  import {onMounted, PropType, ref} from 'vue'
  import {api} from '@/api.ts'
  import {IQTableColumn, IQTableComponent, IQTablePagination} from '@/types/quasar.ts'
  import TableCell from '@/components/crud/table-cells/TableCell.vue'
  import {useRouter} from 'vue-router'

  const props = defineProps({
    columns: {
      type: Array as PropType<Array<IQTableColumn>>,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    search: {
      type: Boolean,
      default: false,
    },
    createRoute: {
      type: [String, Boolean, Object],
      default: () => false,
    },
    editRoute: {
      type: [Function, Boolean],
      default: () => false,
    },
    hasDelete: {
      type: Boolean,
      default: false,
    },
  })

  const router = useRouter()

  const tableRef = ref<IQTableComponent>()
  const rows = ref<Array<any>>([])
  const pagination = ref<IQTablePagination>({sortBy: 'id', descending: false, page: 1, rowsPerPage: 50})
  const loading = ref(false)
  const filter = ref('')

  const perPageOptions = [5, 10, 20, 50, 100, 300, 500]

  async function onRequest(params: { pagination: Omit<IQTablePagination, 'rowsNumber'>, filter?: string }) {
    interface IListData<T = any> {
      items: Array<T>,
      count: number,
      limit: number,
      offset: number
    }

    loading.value = true

    const {data} = await api.get<IListData>(props.url, {
      params: {
        limit: params.pagination.rowsPerPage,
        offset: (params.pagination.page - 1) * params.pagination.rowsPerPage,
        sort: params.pagination.sortBy,
        order: params.pagination.descending ? 'desc' : 'asc',
        search: params.filter,
      },
    })

    rows.value = data.items

    pagination.value = {
      ...params.pagination,
      rowsNumber: data.count,
    }

    loading.value = false
  }

  function onEdit(entity: any) {
    if (typeof props.editRoute === 'function') {
      router.push(props.editRoute(entity))
    }
  }

  async function onDelete(entity: any) {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${props.url}/${entity.id}`)
      } catch (e) {
      }

      tableRef.value?.requestServerInteraction()
    }
  }

  onMounted(() => {
    tableRef.value?.requestServerInteraction()
  })
</script>
