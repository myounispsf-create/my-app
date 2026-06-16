<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">🔐 Login</h1>

      <input
        v-model="username"
        placeholder="Username"
        class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 text-lg focus:outline-none focus:border-blue-400"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 text-lg focus:outline-none focus:border-blue-400"
      />

      <button
        @click="login"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-lg transition"
      >
        Login
      </button>

      <p v-if="error" class="text-red-500 text-center mt-3">{{ error }}</p>

      <p class="text-center mt-4 text-gray-600">
        Don't have an account?
        <span
          @click="$router.push('/register')"
          class="text-blue-500 font-bold cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

async function login() {
  try {
    const res = await fetch('https://my-app-production-ada4.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      router.push('/')
    } else {
      error.value = data.message
    }
  } catch (err) {
    error.value = 'Something went wrong!'
  }
}
</script>