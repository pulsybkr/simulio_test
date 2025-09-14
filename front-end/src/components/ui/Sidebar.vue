<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col',
        isCollapsed ? 'w-16' : 'w-64',
        isMobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden lg:flex'
      ]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <router-link
          to="/dashboard"
          :class="[
            'font-bold text-gray-900 transition-all duration-300',
            isCollapsed ? 'text-lg' : 'text-xl'
          ]"
        >
          {{ isCollapsed ? 'S' : 'Simulio' }}
        </router-link>
        
        <!-- Toggle button -->
        <button
          @click="toggleSidebar"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 hidden lg:block"
        >
          <ChevronLeft v-if="!isCollapsed" class="h-5 w-5" />
          <ChevronRight v-else class="h-5 w-5" />
        </button>

        <!-- Mobile close button -->
        <button
          @click="closeMobileMenu"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
            $route.path === item.href
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
          active-class="bg-indigo-100 text-indigo-700"
        >
          <component
            :is="item.icon"
            :class="[
              'flex-shrink-0 h-5 w-5 transition-colors duration-200',
              $route.path === item.href
                ? 'text-indigo-500'
                : 'text-gray-400 group-hover:text-gray-500',
              isCollapsed ? 'mr-0' : 'mr-3'
            ]"
          />
          <span v-if="!isCollapsed" class="truncate">{{ item.name }}</span>
          
          <!-- Tooltip pour mode collapsed -->
          <div
            v-if="isCollapsed"
            class="absolute left-16 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap"
          >
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center">
          <div
            class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
            @click="handleLogout"
            title="Se déconnecter"
          >
            {{ userInitials }}
          </div>
          
          <div v-if="!isCollapsed" class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ authStore.fullName }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ authStore.role }}
            </p>
          </div>

          <button
            v-if="!isCollapsed"
            @click="handleLogout"
            class="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
            title="Se déconnecter"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40"
      @click="closeMobileMenu"
    ></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile header -->
      <div class="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button
          @click="openMobileMenu"
          class="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu class="h-6 w-6" />
        </button>
        
        <router-link to="/dashboard" class="text-xl font-bold text-gray-900">
          Simulio
        </router-link>

        <!-- Mobile user menu -->
        <div class="relative">
          <button
            @click="handleLogout"
            class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
            title="Se déconnecter"
          >
            {{ userInitials }}
          </button>
          
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <LogoutModal
    :isOpen="showLogoutModal"
    @close="showLogoutModal = false"
    @confirmed="showLogoutModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  LogOut
} from 'lucide-vue-next'
import LogoutModal from './LogoutModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const showLogoutModal = ref(false)

const navigationItems = computed(() => {
  const items = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Simulations',
      href: '/simulations',
      icon: BarChart3
    }
  ]

  // Ajouter Clients seulement pour admin et agent
  if (authStore.isAdmin || authStore.isAgent) {
    items.splice(1, 0, {
      name: 'Clients',
      href: '/clients',
      icon: Users
    })
  }

  // Ajouter Nouvelle Simulation seulement pour admin/agent
  if (!authStore.isClient) {
    items.push({
      name: 'Nouvelle Simulation',
      href: '/simulate',
      icon: Plus
    })
  }

  return items
})

const userInitials = computed(() => {
  const fullName = authStore.fullName || ''
  const names = fullName.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  } else if (names.length === 1) {
    return names[0][0]?.toUpperCase() || 'U'
  }
  return 'U'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const openMobileMenu = () => {
  isMobileMenuOpen.value = true
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  showLogoutModal.value = true
}


</script>

<style scoped>
.user-menu {
  position: relative;
}
</style>
