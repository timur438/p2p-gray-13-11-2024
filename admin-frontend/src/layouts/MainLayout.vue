<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>Admin Panel</q-toolbar-title>
        <q-btn flat round>
          <q-avatar>
            <q-img src="https://cdn.quasar.dev/img/avatar.png"/>
          </q-avatar>
          <q-menu>
            <q-list>
              <q-item clickable @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>

        <q-item :to="{name: 'payment'}" exact>
          <q-item-section avatar>
            <q-icon name="dashboard"/>
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item :to="{name: 'apps.list'}" exact>
          <q-item-section avatar>
            <q-icon name="apps"/>
          </q-item-section>
          <q-item-section>Apps</q-item-section>
        </q-item>

        <q-item :to="{name: 'bank-accounts.list'}" exact>
          <q-item-section avatar>
            <q-icon name="account_balance"/>
          </q-item-section>
          <q-item-section>Bank Accounts</q-item-section>
        </q-item>

        <q-item :to="{name: 'managers.list'}" exact>
          <q-item-section avatar>
            <q-icon name="supervisor_account"/>
          </q-item-section>
          <q-item-section>Managers</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="route.name"/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
  import {ref} from 'vue'
  import {useRoute} from 'vue-router'
  import {authSvc} from '@/services/auth.ts'

  const route = useRoute()

  const leftDrawerOpen = ref(false)

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  function logout() {
    authSvc.logout()
    location.reload()
  }
</script>
