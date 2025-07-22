<template>
  <header class="bg-[#242629] border-b border-[#222] relative z-30">
    <div class="container mx-auto max-w-[1400px] px-4">
      <div class="flex items-center justify-between h-16 relative">
        <!-- Hamburger Menu (Mobile, right) -->
        <button class="action-btn-mobile block flex lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20" @click="isMenuOpen = true">
          <IconMenu />
        </button>

        <!-- Logo (center on mobile, right on desktop) -->
        <div class="flex items-center lg:order-1 order-2 w-full lg:w-auto lg:justify-start justify-center">
          <NuxtLink to="/" class="flex-shrink-0">
            <NuxtImg src="/FilmTarsnakLogo3.png" alt="Filmtarsnak Logo" class="h-8" />
          </NuxtLink>
          <!-- Desktop Nav -->
          <nav class="hidden lg:flex items-center gap-4 mr-6">
            <NuxtLink v-for="item in navItems" :key="item.text" :to="item.link" class="text-gray-300 hover:text-white transition-colors">
              {{ item.text }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 lg:order-2 order-3 lg:ml-0 ml-auto">
          <!-- Mobile Actions -->
          <button class="action-btn-mobile lg:hidden"><IconBack /></button>
          <button class="action-btn-mobile lg:hidden"><IconNotification /></button>
          <!-- Desktop Actions -->
          <div class="hidden lg:flex items-center gap-1">
             <button class="action-btn "><IconSearch /></button>
             <button class="action-btn"><IconNotification /></button>
             <button class="action-btn"><IconFavorite /></button>
             <button class="action-btn"><IconUser /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Nav -->
    <transition name="slide">
      <div v-if="isMenuOpen" class="fixed inset-0 z-40 flex lg:hidden">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-40" @click="isMenuOpen = false"></div>
        <!-- Drawer -->
        <div class="ml-auto w-64 bg-[#242629] h-full shadow-lg p-6 relative z-50 flex flex-col">
          <button class="absolute left-4 top-4 text-white" @click="isMenuOpen = false">
            <span class="text-lg">×</span>
          </button>
          <nav class="flex flex-col gap-6 mt-12">
            <NuxtLink v-for="item in navItems" :key="item.text" :to="item.link" @click="isMenuOpen = false" class="text-gray-300 hover:text-white transition-colors text-lg">
              {{ item.text }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconMenu from '~/components/Icons/IconMenu.vue';
import IconSearch from '~/components/Icons/IconSearch.vue';
import IconNotification from '~/components/Icons/IconNotification.vue';
import IconFavorite from '~/components/Icons/IconFavorite.vue';
import IconUser from '~/components/Icons/IconUser.vue';
import IconBack from '~/components/Icons/IconBack.vue';

const isMenuOpen = ref(false);

const navItems = [
  { text: 'دسته بندی ها', link: '/categories' },
  { text: 'فیلم', link: '/movies' },
  { text: 'سریال', link: '/series' },
  { text: 'بازیگران', link: '/actors' },
  { text: 'جدیدترین دوبله ها', link: '/dubbed' },
];
</script>

<style>
.action-btn-mobile {
  @apply bg-[#23272e] rounded-full w-9 h-9  items-center justify-center text-white transition-colors hover:bg-[#353a40];
}
.action-btn {
  @apply bg-[#1B1C1F] w-12 h-12 flex items-center justify-center text-white transition-colors hover:bg-[#353a40];
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style> 