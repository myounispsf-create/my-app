<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">

      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">📝 My Todo App</h1>
        <div class="flex items-center gap-3">
          <span class="text-gray-600 font-medium">👋 {{ username }}</span>
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Add Todo -->
      <div class="flex gap-3 mb-6">
        <input
          v-model="newTodo"
          placeholder="Enter a todo..."
          class="flex-1 border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
        />
        <button
          @click="addTodo"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition"
        >
          Add
        </button>
      </div>

      <!-- Todo List -->
      <ul class="space-y-3">
        <li
          v-for="todo in todos"
          :key="todo._id"
          class="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border-l-4 border-blue-400"
        >
          <!-- Checkbox -->
          <input
            type="checkbox"
            :checked="todo.done"
            @change="toggleDone(todo._id)"
            class="w-5 h-5 cursor-pointer"
          />

          <!-- Text or Edit Input -->
          <span
            v-if="!todo.editing"
            :class="todo.done ? 'line-through text-gray-400 flex-1' : 'flex-1 text-gray-800'"
          >
            {{ todo.text }}
          </span>
          <input
            v-else
            v-model="todo.text"
            class="flex-1 border-2 border-blue-400 rounded-lg px-3 py-1 text-lg focus:outline-none"
          />

          <!-- Buttons -->
          <div class="flex gap-2">
            <button
              @click="startEdit(todo)"
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
            >
              ✏️
            </button>
            <button
              v-if="todo.editing"
              @click="saveEdit(todo)"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
            >
              💾
            </button>
            <button
              @click="deleteTodo(todo._id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              ❌
            </button>
          </div>
        </li>
      </ul>

      <!-- Empty State -->
      <div v-if="todos.length === 0" class="text-center text-gray-400 mt-10">
        <p class="text-xl">No todos yet! Add one above 👆</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const todos = ref([])
const newTodo = ref('')
const username = ref(localStorage.getItem('username') || '')
const token = localStorage.getItem('token')

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

onMounted(async () => {
  if (!token) {
    router.push('/login')
    return
  }
  const res = await fetch('http://localhost:5000/api/todos', { headers })
  todos.value = await res.json()
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}

async function addTodo() {
  if (!newTodo.value) return
  const res = await fetch('http://localhost:5000/api/todos', {
    method: 'POST',
    headers,
    body: JSON.stringify({ text: newTodo.value })
  })
  const data = await res.json()
  todos.value.push(data)
  newTodo.value = ''
}

async function deleteTodo(id) {
  await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: 'DELETE',
    headers
  })
  todos.value = todos.value.filter(t => t._id !== id)
}

async function toggleDone(id) {
  await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: 'PUT',
    headers
  })
  todos.value = todos.value.map(t =>
    t._id === id ? { ...t, done: !t.done } : t
  )
}

function startEdit(todo) {
  todo.editing = true
}

async function saveEdit(todo) {
  await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ text: todo.text })
  })
  todo.editing = false
}
</script>