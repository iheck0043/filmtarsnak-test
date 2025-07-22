<template>
  <div class="flex flex-wrap items-center" :class="gapClass" :style="containerStyle">
          <button
        v-for="star in maxStars"
        :key="star"
        @click="handleRating(star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
        class="flex-shrink-0 transition-transform focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :class="hoverEffectClass"
        :disabled="disabled"
      >
      <IconStarRating
        :class="[
          starSizeClass,
          'transition-all duration-200',
          (hoverRating >= star || (!hoverRating && currentRating >= star))
            ? 'text-yellow-400 fill-current star-selected' 
            : 'text-gray-500'
        ]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import IconStarRating from '~/components/Icons/IconStarRating.vue';

interface Props {
  modelValue: number;
  maxStars?: number;
  disabled?: boolean;
  initialRating?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxStars: 5,
  disabled: false,
  initialRating: 1
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

// Local hover state
const hoverRating = ref<number>(0);

// Computed rating - use modelValue if user has rated, otherwise use initialRating as default
const currentRating = computed(() => {
  return props.modelValue > 0 ? props.modelValue : props.initialRating;
});

// Dynamic star sizing based on number of stars to fit in one line
const starSizeClass = computed(() => {
  // Calculate size dynamically based on available space
  if (props.maxStars <= 5) return 'w-7 h-7';       // 28px - خیلی بزرگ
  if (props.maxStars <= 8) return 'w-6 h-6';       // 24px - بزرگ  
  if (props.maxStars <= 12) return 'w-5 h-5';      // 20px - متوسط
  if (props.maxStars <= 18) return 'w-4 h-4';      // 16px - کوچک
  if (props.maxStars <= 25) return 'w-3 h-3';      // 12px - خیلی کوچک
  if (props.maxStars <= 35) return 'w-2.5 h-2.5';  // 10px - بسیار کوچک
  if (props.maxStars <= 50) return 'w-2 h-2';      // 8px - نازک
  return 'w-1.5 h-1.5';                           // 6px - بسیار نازک
});

// Responsive gap based on number of stars
const gapClass = computed(() => {
  if (props.maxStars <= 5) return 'gap-1.5';     // فاصله زیاد برای ستاره‌های بزرگ
  if (props.maxStars <= 10) return 'gap-1';      // فاصله متوسط
  if (props.maxStars <= 18) return 'gap-0.5';    // فاصله کم
  if (props.maxStars <= 35) return 'gap-px';     // فاصله خیلی کم
  return 'gap-0';                                // بدون فاصله برای ستاره‌های بسیار کوچک
});

// Container style to ensure single line
const containerStyle = computed(() => ({
  width: '100%',
  overflow: 'hidden'
}));

// Hover effect based on star size - smaller stars need less scale
const hoverEffectClass = computed(() => {
  if (props.maxStars <= 12) return 'hover:scale-110';     // بزرگ شدن 10%
  if (props.maxStars <= 25) return 'hover:scale-105';     // بزرگ شدن 5%
  if (props.maxStars <= 35) return 'hover:scale-[1.03]';  // بزرگ شدن 3%
  return 'hover:scale-[1.01]';                           // بزرگ شدن 1% برای ستاره‌های بسیار کوچک
});

// Handle star click
const handleRating = (rating: number) => {
  if (props.disabled) return;
  emit('update:modelValue', rating);
  hoverRating.value = 0;
};
</script>

<style scoped>
/* Selected star styling */
:deep(.star-selected) {
  color: #fbbf24 !important;
}

:deep(.star-selected path) {
  fill: #fbbf24 !important;
}

/* Ensure stars never wrap to next line */
.flex-shrink-0 {
  flex-shrink: 0;
  min-width: 0;
}

/* Additional responsive scaling for very small stars */
@media (max-width: 640px) {
  .w-2\.5 {
    width: 0.5rem;
    height: 0.5rem;
  }
  
  .w-2 {
    width: 0.4rem;
    height: 0.4rem;
  }
  
  .w-1\.5 {
    width: 0.3rem;
    height: 0.3rem;
  }
}

/* Ensure very small stars are still clickable */
.w-1\.5 button, .w-2 button {
  min-width: 1rem;
  min-height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 