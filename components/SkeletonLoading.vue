<template>
  <div class="bg-[#1B1C1F] text-white min-h-screen font-sans animate-pulse">
    <div class="container mx-auto max-w-[1400px] space-y-6">
      <!-- Movie Info Section Skeleton -->
      <div class="bg-[#242629] rounded-lg p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- right: movie info -->
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-start gap-4">
              <!-- poster -->
              <div class="w-24 h-36 sm:w-32 sm:h-48 bg-gray-700 rounded-lg mx-auto sm:mx-0"></div>
              <!-- info -->
              <div class="flex-1 text-center sm:text-right">
                <div class="h-8 bg-gray-700 rounded w-64 mb-2 mx-auto sm:mx-0"></div>
                <div class="h-6 bg-gray-600 rounded w-48 mb-4 mx-auto sm:mx-0"></div>
                <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                  <div class="h-6 bg-gray-600 rounded w-16"></div>
                  <div class="h-6 bg-gray-600 rounded w-12"></div>
                  <div class="h-6 bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- left: score -->
          <div class="lg:w-80">
            <div class="bg-[#1B1C1F] rounded-lg p-4 mb-4">
              <div class="h-4 bg-gray-600 rounded w-20 mb-3 mx-auto"></div>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-[#242629] p-3 rounded h-16"></div>
                <div class="bg-[#242629] p-3 rounded h-16"></div>
                <div class="bg-[#242629] p-3 rounded h-16"></div>
                <div class="bg-[#242629] p-3 rounded h-16"></div>
              </div>
            </div>
            <!-- buttons -->
            <div class="flex gap-3">
              <div class="flex-1 h-12 bg-gray-700 rounded-lg"></div>
              <div class="h-12 w-16 bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player and Episodes Section Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
        <!-- Player section skeleton -->
        <div class="lg:col-span-8">
          <!-- Movie controls skeleton -->
          <div class="flex items-center justify-between mb-4 h-10">
            <div class="flex items-center">
              <div class="hidden lg:flex bg-gray-700 rounded w-16 h-20 mr-2"></div>
              <div>
                <div class="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                <div class="h-4 bg-gray-600 rounded w-32"></div>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="h-6 bg-gray-700 rounded w-24"></div>
              <div class="h-8 bg-gray-700 rounded w-20"></div>
            </div>
          </div>

          <!-- Video player skeleton -->
          <div class="bg-gray-800 rounded-lg mb-4 h-64 lg:h-96 flex items-center justify-center">
            <div class="w-16 h-16 bg-gray-600 rounded-full"></div>
          </div>

          <!-- Viewing issues skeleton -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-700 rounded w-48"></div>
              <div class="flex gap-2">
                <div class="h-10 bg-gray-700 rounded w-16"></div>
                <div class="h-10 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div class="bg-gray-800 h-11 rounded-lg"></div>
          </div>
        </div>

        <!-- Episodes list skeleton -->
        <div class="lg:col-span-4">
          <div class="h-6 bg-gray-700 rounded w-24 mb-4"></div>
          <div class="space-y-2">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
              <div class="w-16 h-16 bg-gray-700 rounded"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-600 rounded w-24 mb-2"></div>
                <div class="h-3 bg-gray-600 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 