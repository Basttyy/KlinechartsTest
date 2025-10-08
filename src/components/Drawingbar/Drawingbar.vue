<template>
  <div class="flex flex-col bg-gray-800 text-white p-2 pt-10 space-y-4 items-center">
    <div @click="addVerticalLine" class="tool-button">
      <VerticalStraightLine />
    </div>
    <div @click="addHorizontalLine" class="tool-button">
      <StraighLine />
    </div>
    <div @click="addTrendline" class="tool-button">
      <Segment />
    </div>
  </div>
</template>

<script setup lang="ts">
import { chart, overlayIds } from '../../constants';
import Segment from './Icons/Segment.vue';
import StraighLine from './Icons/StraighLine.vue';
import VerticalStraightLine from './Icons/VerticalStraightLine.vue';

const addVerticalLine = () => {
  console.log('Vertical Line tool selected');
  chart.value?.createOverlay({ name: 'verticalStraightLine', id: `overlay_${overlayIds.value.length + 1}`})
  overlayIds.value.push(overlayIds.value.length + 1)
};

const addHorizontalLine = () => {
  console.log('Horizontal Line tool selected');
  chart.value?.createOverlay({ name: 'straightLine', id: `overlay_${overlayIds.value.length + 1}`})
  overlayIds.value.push(overlayIds.value.length + 1)
};

const addTrendline = () => {
  console.log('Trendline tool selected');
  chart.value?.createOverlay({ name: 'segment', id: `overlay_${overlayIds.value.length + 1}`})
  overlayIds.value.push(overlayIds.value.length + 1)
};
</script>

<style scoped>
.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #2d3748; /* Tailwind gray-800 */
  border: 1px solid #4a5568; /* Tailwind gray-700 */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.tool-button:hover {
  background-color: #4a5568; /* Tailwind gray-700 */
}

.tool-button:active {
  transform: scale(0.95);
}

svg {
  width: 24px;
  height: 24px;
  fill: #ffffff;
}
</style>