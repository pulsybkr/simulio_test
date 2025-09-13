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
            class="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer"
            @click="showUserMenu = !showUserMenu"
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
            @click="showUserMenu = !showUserMenu"
            class="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          >
            <ChevronUp v-if="showUserMenu" class="h-4 w-4" />
            <ChevronDown v-else class="h-4 w-4" />
          </button>
        </div>

        <!-- User Menu Dropdown -->
        <div
          v-if="showUserMenu && !isCollapsed"
          class="mt-2 py-1 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut class="h-4 w-4 mr-2" />
            Se déconnecter
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
            @click="showMobileUserMenu = !showMobileUserMenu"
            class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
          >
            {{ userInitials }}
          </button>
          
          <div
            v-if="showMobileUserMenu"
            class="absolute right-0 mt-2 w-48 py-1 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <div class="px-3 py-2 border-b border-gray-200">
              <p class="text-sm font-medium text-gray-900">{{ authStore.fullName }}</p>
              <p class="text-xs text-gray-500">{{ authStore.role }}</p>
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <LogOut class="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>

  <!-- Logout Confirmation Modal -->
  <div
    v-if="showLogoutModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-6 w-6 text-yellow-600" />
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">
            Confirmer la déconnexion
          </h3>
        </div>
      </div>
      
      <p class="text-sm text-gray-500 mb-6">
        Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
      </p>
      
      <div class="flex justify-end space-x-3">
        <Button
          @click="showLogoutModal = false"
          variant="outline"
        >
          Annuler
        </Button>
        <Button
          @click="confirmLogout"
          variant="destructive"
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Menu,
  X,
  LogOut,
  AlertTriangle
} from 'lucide-vue-next'
import Button from './Button.vue'

const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showMobileUserMenu = ref(false)
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

  // Ajouter Nouvelle Simulation seulement pour admin et agent (pas pour les clients)
  if (authStore.isAdmin || authStore.isAgent) {
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
  showUserMenu.value = false
  showMobileUserMenu.value = false
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  try {
    await authStore.logout()
    showLogoutModal.value = false
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Fermer les menus quand on clique ailleurs
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
    showMobileUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: relative;
}
</style>
