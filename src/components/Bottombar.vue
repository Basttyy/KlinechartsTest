<template>
    <div class="flex justify-between bg-gray-800 text-white p-1">
        <div class="flex space-x-4 ml-10">
            <button @click="togglePlayPause" class="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer">
                {{ isPlaying ? 'Pause' : 'Play' }}
            </button>
            <button @click="stepForward" class="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer">
                Step Forward
            </button>
            <select v-model="speed" class="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer">
                <option v-for="option in speedOptions" :key="option" :value="option">
                    Speed: {{ option }}x
                </option>
            </select>
            <select v-model="replayInterval" class="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer">
                <option v-for="interval in replayIntervals" :key="interval" :value="interval">
                    Replay Interval: {{ interval }}mins
                </option>
            </select>
        </div>
        <button @click="confirmExit" class="px-4 py-2 mr-11 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer">
            Exit (×)
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { chart, replayOverlay, period, historyData, showExitConfirmation, chartTimestamp, base_url, options } from '../constants';
import dayjs from '../dayjs';
import type { KLineData } from '@basttyy/klinecharts';
import { calculateTimeframe, getIsoYearMonthWeekDay } from '../helpers';

const isPlaying = ref(false);
const speed = ref(0.1);
const replayInterval = ref(5);
const currentReplayTimestamp = ref<number | null>(null);
let replayIntervalId: number | null = null;

const speedOptions = [0.1, 0.2, 0.5, 1, 1.5, 2];
const replayIntervals = [1, 5, 10, 15];

const startReplay = async () => {
    if (!chart.value) return;

    isPlaying.value = true;
    currentReplayTimestamp.value =
        chartTimestamp.value || dayjs().utc().subtract(1, 'day').valueOf();

    const loadDayData = async (timestamp: number) => {
        const daymonthyear = getIsoYearMonthWeekDay(timestamp);
        const resp = await fetch(
            `${base_url}/minute/BTC-USD/ASK/${daymonthyear.year}/${daymonthyear.monthOfYear}/${daymonthyear.dayOfMonth}`,
            options
        );

        if (!resp.ok) {
            console.info(await resp.json());
            return null;
        }

        return await resp.json();
    };

    historyData.value = await loadDayData(currentReplayTimestamp.value);
    if (!historyData.value) return;

    const intervalDuration = speed.value * 1000;
    const timeframeMinutes = calculateTimeframe(period.value);


    let datalen = historyData.value.times?.length || 0;
    let multiplier = historyData.value.multiplier || 1;
    let shift = historyData.value.shift || 1;

    let currentCandle: KLineData | null = null;
    let accumulatedMinutes = 0;
    let dataIndex = 0;
    let open = historyData.value.open;
    let high = historyData.value.high;
    let low = historyData.value.low;
    let close = historyData.value.close;
    let timestamp = 0

    replayIntervalId = window.setInterval(async () => {
        if (!currentReplayTimestamp.value || !historyData.value) return;

        for (let i = 0; i < replayInterval.value; i++) {
            // Out of data for the current day -> move to next
            if (dataIndex >= datalen) {
                currentReplayTimestamp.value = dayjs
                    .utc(currentReplayTimestamp.value)
                    .add(1, 'day')
                    .valueOf();

                historyData.value = await loadDayData(currentReplayTimestamp.value);
                if (!historyData.value) return;

                datalen = historyData.value.times?.length || 0;
                multiplier = historyData.value.multiplier || 1;
                shift = historyData.value.shift || 1;
                dataIndex = 0; // reset for new day
                open = historyData.value.open;
                high = historyData.value.high;
                low = historyData.value.low;
                close = historyData.value.close;
                timestamp = 0
            }

            // Extract next tick data
            open += (historyData.value.opens?.[dataIndex] || 0) * multiplier;
            high += (historyData.value.highs?.[dataIndex] || 0) * multiplier;
            low += (historyData.value.lows?.[dataIndex] || 0) * multiplier;
            close += (historyData.value.closes?.[dataIndex] || 0) * multiplier;
            const volumeTick = historyData.value.volumes?.[dataIndex] || 0;
            timestamp =
                historyData.value.timestamp +
                (historyData.value.times?.[dataIndex] || 0) * dataIndex * shift;

            // If no current candle (new one starts)
            if (!currentCandle) {
                currentCandle = {
                    timestamp,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    volume: volumeTick,
                };
            } else {
                // Update candle within same period
                currentCandle.high = Math.max(currentCandle.high, high);
                currentCandle.low = Math.min(currentCandle.low, low);
                currentCandle.close = close;
                currentCandle.volume = (currentCandle.volume || 0) + volumeTick;
            }

            accumulatedMinutes++;
            dataIndex++;

            // When accumulatedMinutes reach timeframeMinutes, finalize and push candle
            // if (accumulatedMinutes >= timeframeMinutes) {
            //     chart.value?.updateData(currentCandle);
            //     accumulatedMinutes = 0;
            //     currentReplayTimestamp.value = currentCandle.timestamp;
            //     currentCandle = null; // start a fresh one next tick
            // }
        }
        chart.value?.updateData(currentCandle!);

        if (accumulatedMinutes >= timeframeMinutes) {
            currentReplayTimestamp.value = timestamp; // Move to the next candle
            accumulatedMinutes = 0;
            currentCandle = null;
        }
    }, intervalDuration);
};

const stopReplay = () => {
    isPlaying.value = false;
    if (replayIntervalId) {
        clearInterval(replayIntervalId);
        replayIntervalId = null;
    }
};

const togglePlayPause = () => {
    if (isPlaying.value) {
        stopReplay();
    } else {
        startReplay();
    }
};

const stepForward = () => {
    console.log('Step Forward clicked');
    // Add logic to step forward to the next candle
};

const confirmExit = () => {
    showExitConfirmation.value = true;
};

watch(replayOverlay, (newValue) => {
    if (!newValue) {
        stopReplay();
    }
});

// export { isPlaying, speed, replayInterval, togglePlayPause };
</script>

<style scoped>
button {
    transition: background-color 0.2s;
}
</style>