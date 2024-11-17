import {Component, computed, defineAsyncComponent, ref} from 'vue'

const layoutComponents: Record<string, Component> = {
  main: defineAsyncComponent(() => import('@/layouts/MainLayout.vue')),
  empty: defineAsyncComponent(() => import('@/layouts/EmptyLayout.vue')),
}

const defaultLayout = 'main'

export const layoutName = ref<string>('main')

export function setLayout(name: keyof typeof layoutComponents) {
  layoutName.value = name
}

export const layoutComponent = computed(
  () => layoutName.value in layoutComponents
    ? layoutComponents[layoutName.value]
    : layoutComponents[defaultLayout],
)
