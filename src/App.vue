<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { init, dispose, registerOverlay } from '@basttyy/klinecharts'
import Topbar from './components/Topbar.vue'
import { computeInitialChartData, loadMoreData } from './dataprocessor'
import { bottombar, chart, chartContainer, chartHeight, replayOverlay, period, showExitConfirmation, topbar, windowWidth, bottombarHeight } from './constants'
import Bottombar from './components/Bottombar.vue'
import { watchDebounced } from '@vueuse/core'
import { cancelExit, exit, updateSize } from './helpers'
import Toolsbar from './components/Drawingbar/Drawingbar.vue'
import SelectReplay from './components/Drawingbar/Overlays/SelectReplay'

onMounted(async () => {
  registerOverlay(SelectReplay)
  chart.value = init('container');
  if (!chart.value) return;

  chart.value.loadMore(loadMoreData);
  chart.value.setTimezone('Etc/UTC');

  const initialData = await computeInitialChartData();
  chart.value.applyNewData(initialData, true);
	window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  dispose('container')
	window.removeEventListener('resize', updateSize)
})

watchDebounced(period, async () => {
  if (!chart.value)
    return
  const initialData = await computeInitialChartData();
  chart.value.applyNewData(initialData, true);
})

watchDebounced(replayOverlay, async (newValue) => {
  if (newValue && chart.value) {
      bottombar.value = bottombarHeight
      updateSize()
    const initialData = await computeInitialChartData();
    chart.value.applyNewData(initialData, true);
    chart.value.removeOverlay(newValue)
    replayOverlay.value = null
  }
}, { debounce: 500})

watchDebounced(
  bottombar,
  () => {
    updateSize()
  },
  { debounce: 300 } // Delay in milliseconds
);

</script>

<template>
  <div class="h-screen w-full flex flex-col">
      <div class="h-screen w-full flex flex-col">
        <Topbar :style="{ height: `${topbar}px` }" />
        <div :style="{ height: `${chartHeight}px` }" class="w-full flex">
          <Toolsbar :style="{ width: '53px', height: `${chartHeight}px` }" />
          <div ref="chartContainer" :style="{ height: `${chartHeight}px`, width: `${windowWidth - 53}px` }" id="container" class="bg-green chart-container"></div>
        </div>
        <Bottombar v-if="bottombar > 0" :style="{ height: `${bottombar}px`}" />
      </div>


    <div v-if="showExitConfirmation" style="z-index: 99;" class="fixed inset-0 bg-grey-500 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-4 rounded shadow-sm text-black">
        <p>Are you sure you want to exit?</p>
        <div class="flex justify-end space-x-4 mt-4">
          <button @click="exit" class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded">Yes</button>
          <button @click="cancelExit" class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">No</button>
        </div>
      </div>
    </div>
  </div>
</template>