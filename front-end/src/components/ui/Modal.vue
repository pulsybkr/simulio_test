<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <div
        ref="modalContent"
        :class="[
          'bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto',
          sizeClasses
        ]"
        @click.stop
      >
        <!-- Header -->
        <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <slot name="header">
              <h3 class="text-lg font-medium text-gray-900">
                {{ title }}
              </h3>
            </slot>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true
})

const emit = defineEmits<{
  close: []
}>()

const modalContent = ref<HTMLElement>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  }
  return sizes[props.size]
})

const close = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
