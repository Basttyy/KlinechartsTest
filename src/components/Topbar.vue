<template>
  <div class="flex justify-between bg-gray-800 text-white p-1">
    <div class="flex space-x-4 ml-10">
      <button
        v-for="timeframe in timeframes"
        :key="timeframe.text"
        @click="changePeriod(timeframe)"
        class="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
      >
        {{ timeframe.text }}
      </button>
    </div>
    <button @click="replay" class="px-4 py-2 mr-11 bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer">
      Replay
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { chart, overlayIds, period } from "../constants";
import type { Period } from "../types";

const replayOverlayId = ref<string|null>(null)

const timeframes: Period[] = [
  { multiplier: 1, text: "1min", timespan: "minute" },
  { multiplier: 5, text: "5min", timespan: "minute" },
  { multiplier: 15, text: "15min", timespan: "minute" },
  { multiplier: 20, text: "20min", timespan: "minute" },
  { multiplier: 30, text: "30min", timespan: "minute" },
];

const changePeriod = (newPeriod: Period) => {
  period.value = newPeriod;
};

const replay = () => {
  console.log("Replay clicked");
  chart.value?.createOverlay({ name: 'select_replay', id: `overlay_${overlayIds.value.length + 1}`})
  replayOverlayId.value = `overlay_${overlayIds.value.length + 1}`
  overlayIds.value.push(overlayIds.value.length + 1)
};
</script>

<!-- <style scoped>
button {
  transition: background-color 0.2s;
}
</style> -->