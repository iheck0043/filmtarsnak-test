<template>
  <div class="bg-[#242629] rounded-xl p-4 mt-2">
    <!-- Header -->
    <div class="text-center mb-4">
      <h3 class="text-base font-bold text-white mb-2">
        آیا تماشای سریال اکامیوتو را به دیگران پیشنهاد می‌کنید؟
      </h3>
      <p class="text-xs text-gray-400">
        نظر خود را در این رابطه بنویسید
      </p>
    </div>

    <!-- Opinion Type Selection -->
    <div class="mb-4">
         <!-- Spoiler Warning Checkbox -->
         <label class="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
        <input 
          v-model="includeSpoilerWarning"
          type="checkbox" 
          class="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600 focus:ring-2"
        >
        <span>این نظر حاوی اسپویل هست</span>
      </label>
      <div class="flex gap-2 mb-4 mt-4">
        <button
          @click="opinionType = 'positive'"
          :class="[
            ' h-11 px-4 rounded-md text-xs font-medium transition-all  flex justify-center items-center',
            opinionType === 'positive' 
              ? 'bg-[#341A1B] text-white border border-[#AB070F]' 
              : 'bg-[#1B1C1F] text-gray-300 border border-[#1B1C1F] hover:border-gray-500'
          ]"
        >
          نظرتون شامل نقد نیست
        </button>
        <button
          @click="opinionType = 'critical'"
          :class="[
            ' h-11 px-4 rounded-md text-xs font-medium transition-all flex justify-center items-center',
            opinionType === 'critical' 
              ? 'bg-[#341A1B] text-white border border-[#AB070F]' 
              : 'bg-[#1B1C1F] text-gray-300 border border-[#1B1C1F] hover:border-gray-500'
          ]"
        >
          نظرتون شامل نقد است
        </button>
      </div>

   
    </div>

    <!-- Comment Textarea -->
    <div class="mb-2 relative">
      <textarea
        v-model="comment"
        placeholder="متن نظر"
        rows="4"
        :disabled="hasUserRated"
        class="w-full bg-[#1B1C1F] text-xs border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      ></textarea>
      <div class="flex justify-between items-center mt-2 absolute bottom-2 left-2">
        <span class="text-xs text-gray-500">{{ comment.length }} / {{ maxCommentLength }}</span>
      </div>
    </div>

    <!-- Star Rating -->
    <div class="mb-4 flex flex-1 justify-between">
      <StarRatingInput
      class="w-full"
        v-model="userRating"
        :max-stars="maxStars"
        :disabled="hasUserRated"
        :initial-rating="initialRating"
      />
       <!-- Submit Button -->
    <button
      @click="submitRating"
      :disabled="isSubmitting || hasUserRated || !userRating"
      class="text-xs min-w-[142px] bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
    >
      <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <IconCheck v-if="!isSubmitting" class="w-4 h-4" />
      <span>
        {{ hasUserRated ? 'شما قبلاً نظر داده‌اید' : isSubmitting ? 'در حال ارسال...' : 'ارسال نظر' }}
      </span>
    </button>
    </div>

    <!-- Average Rating Display -->
    <div v-if="averageRating > 0" class="mb-4 p-3 bg-[#1B1C1F] rounded-md border border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-300">میانگین امتیاز کاربران:</span>
          <div class="flex items-center gap-1">
            <StarRatingInput
              :model-value="Math.round(averageRating * 10) / 10"
              :max-stars="maxStars"
              :disabled="true"
              :initial-rating="0"
              class="pointer-events-none"
            />
            <span class="text-sm text-white font-medium mr-1">{{ averageRating.toFixed(1) }}</span>
          </div>
        </div>
        <!-- <span class="text-xs text-gray-400">({{ totalRatings }} نظر)</span> -->
      </div>
    </div>

   

    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="mt-3 p-2 bg-green-600/20 border border-green-600 rounded-md">
      <p class="text-green-400 text-xs text-center">
        نظر شما با موفقیت ثبت شد!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRatingInput from '~/components/StarRatingInput.vue';
import IconCheck from '~/components/Icons/IconCheck.vue';

interface Props {
  maxStars?: number;
  initialRating?: number;
  movieId?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  maxStars: 5,
  initialRating: 1
});

const emit = defineEmits<{
  rated: [rating: number, comment: string];
}>();

// Rating state
const userRating = ref<number>(props.initialRating);

// Form state
const comment = ref<string>('');
const opinionType = ref<'positive' | 'critical'>('positive');
const includeSpoilerWarning = ref<boolean>(false);
const maxCommentLength = 500;

// UI state
const isSubmitting = ref<boolean>(false);
const hasUserRated = ref<boolean>(false);
const showSuccessMessage = ref<boolean>(false);

// Average rating from all users
const averageRating = ref<number>(0);
const totalRatings = ref<number>(0);

// Storage key for user rating lock
const storageKey = computed(() => `user_rated_${props.movieId}`);

// Rating API endpoint
const API_ENDPOINT = 'https://ylnk.site/test/';

// Check if user has already rated on component mount
onMounted(() => {
  checkUserRatingStatus();
  loadAverageRating();
});

// Functions
const checkUserRatingStatus = () => {
  if (process.client) {
    const ratedData = localStorage.getItem(storageKey.value);
    if (ratedData) {
      try {
        const { rated, rating, comment: storedComment } = JSON.parse(ratedData);
        hasUserRated.value = rated;
        if (rating) {
          userRating.value = rating;
        }
        if (storedComment) {
          comment.value = storedComment;
        }
      } catch (error) {
        console.error('Error parsing stored rating data:', error);
      }
    }
  }
};

const loadAverageRating = () => {
  if (process.client) {
    const avgData = localStorage.getItem(`avg_rating_${props.movieId}`);
    if (avgData) {
      try {
        const { average, total } = JSON.parse(avgData);
        averageRating.value = average;
        totalRatings.value = total;
      } catch (error) {
        console.error('Error parsing average rating data:', error);
      }
    }
  }
};



const submitRating = async () => {
  if (hasUserRated.value || !userRating.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // API call to submit rating
    const response = await $fetch(`${API_ENDPOINT}?action=rate&id=${props.movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        rate: userRating.value,
        // comment: comment.value,
        // opinion_type: opinionType.value,
        // spoiler_warning: includeSpoilerWarning.value
      }
    });

    // Handle API response
    const responseData = response as { success: boolean; new_rating: number };
    if (responseData.success && responseData.new_rating) {
      // Store new average rating in localStorage
      if (process.client) {
        localStorage.setItem(`avg_rating_${props.movieId}`, JSON.stringify({
          average: responseData.new_rating,
          total: (totalRatings.value || 0) + 1,
          timestamp: Date.now()
        }));
      }
      
      // Update local state
      averageRating.value = responseData.new_rating;
      totalRatings.value = (totalRatings.value || 0) + 1;
    }

    // Store rating in localStorage to prevent re-rating
    if (process.client) {
      localStorage.setItem(storageKey.value, JSON.stringify({
        rated: true,
        rating: userRating.value,
        comment: comment.value,
        timestamp: Date.now()
      }));
    }

    hasUserRated.value = true;
    showSuccessMessage.value = true;
    
    // Emit the rating event
    emit('rated', userRating.value, comment.value);

    // Hide success message after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);

  } catch (error) {
    console.error('Failed to submit rating:', error);
    
    // Show error notification
    alert('خطا در ارسال امتیاز. لطفاً دوباره تلاش کنید.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 4px;
}

textarea::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 2px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style> 