<template>
  <q-page padding>
    <div class="flex flex-center">

      <div class="row">
        <q-card bordered class="q-pa-lg" style="width: 300px">

          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input clearable v-model="login" type="email" label="login"/>
              <q-input clearable v-model="password" type="password" label="password"/>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-md">
            <q-btn color="primary" size="lg" class="full-width" label="Login" @click="handleSubmit"/>
          </q-card-actions>

        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script lang="ts" setup>
  import {ref} from 'vue'
  import {useRouter} from 'vue-router'

  const router = useRouter()

  const login = ref('')
  const password = ref('')

  async function handleSubmit() {
    console.log('Login:', login.value)
    console.log('Password:', password.value)
    // placeholder
  }
</script>
