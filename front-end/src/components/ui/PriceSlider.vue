<template>
  <div class="space-y-4">
    <div class="text-center">
      <div class="text-3xl font-bold text-indigo-600">
        {{ formatCurrency(modelValue) }}
      </div>
      <div class="text-sm text-gray-500 mt-1">
        {{ label }}
      </div>
    </div>

    <div class="relative">
      <input
        :value="modelValue"
        @input="updateValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      
      <div class="flex justify-between text-xs text-gray-400 mt-2">
        <span>{{ formatCurrency(min) }}</span>
        <span>{{ formatCurrency(max) }}</span>
      </div>
    </div>

    <div v-if="shortcuts" class="flex flex-wrap gap-2 justify-center">
      <button
        v-for="shortcut in shortcuts"
        :key="shortcut.value"
        @click="$emit('update:modelValue', shortcut.value)"
        :class="[
          'px-3 py-1 text-xs rounded-full border transition-colors',
          modelValue === shortcut.value
            ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
        ]"
      >
        {{ shortcut.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Shortcut {
  label: string
  value: number
}

interface Props {
  modelValue: number
  label: string
  min: number
  max: number
  step?: number
  shortcuts?: Shortcut[]
}

const props = withDefaults(defineProps<Props>(), {
  step: 1000
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', parseInt(target.value))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #4f46e5 0%, #4f46e5 var(--progress, 0%), #e5e7eb var(--progress, 0%), #e5e7eb 100%);
}

.slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
}
</style>
