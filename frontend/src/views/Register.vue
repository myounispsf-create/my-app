<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>📝 Register</h1>

      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />

      <button class="auth-btn" @click="register">Register</button>

      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>

      <p>Already have an account?
        <span class="link" @click="$router.push('/login')">Login</span>
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
const success = ref('')

async function register() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    const data = await res.json()

    if (res.ok) {
      success.value = data.message
      setTimeout(() => router.push('/login'), 1500)
    } else {
      error.value = data.message
    }
  } catch (err) {
    error.value = 'Something went wrong!'
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

input {
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

input:focus {
  border-color: #2ecc71;
}

.auth-btn {
  padding: 12px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.auth-btn:hover {
  background: #27ae60;
}

.error {
  color: red;
  text-align: center;
}

.success {
  color: green;
  text-align: center;
}

.link {
  color: #3498db;
  cursor: pointer;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}
</style>