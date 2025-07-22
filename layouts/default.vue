<template>
  <div dir="rtl" class="bg-[#1B1C1F]">
    <Header />
    <div class="flex justify-end mx-auto max-w-[1400px] px-4 mt-3 mb-2">
       <button @click="$router.back()" class="flex font-bold items-center justify-center text-sm gap-2 text-gray-300 hover:text-white bg-[#242629] p-2 transition-colors">
        
        <span>بازگشت</span>
        <IconBack />
      </button>
    </div>
    <div class=" mx-auto max-w-[1400px] px-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import IconBack from '~/components/Icons/IconBack.vue';
</script> 