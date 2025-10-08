import type { KLineData } from "@basttyy/klinecharts";
import { adjustFromTo, calculateTimeframe, getIsoYearMonthWeekDay } from "./helpers";
import { base_url, chart, chartTimestamp, historyData, lasttime, options, period } from "./constants";
import dayjs from "./dayjs";

export const fetchAndProcessData = async (from: number, to: number): Promise<KLineData[]> => {
  let currentTimestamp = to;
  let allData: KLineData[] = [];

  while (currentTimestamp >= from) {
    const daymonthyear = getIsoYearMonthWeekDay(currentTimestamp);
    const resp = await fetch(
      `${base_url}/minute/BTC-USD/ASK/${daymonthyear.year}/${daymonthyear.monthOfYear}/${daymonthyear.dayOfMonth}`,
      options
    );

    if (!resp.ok) {
      console.info(await resp.json());
      break;
    }

    historyData.value = await resp.json();

    if (!historyData.value) break;

    let data: KLineData[] = [];
    const datalen = historyData.value.times.length;
    let open = historyData.value.open;
    let high = historyData.value.high;
    let low = historyData.value.low;
    let close = historyData.value.close;
    let bar: KLineData | null = null;
    let count = 0;

    for (let i = 0; i < datalen; i++) {
      open += historyData.value.opens[i]! * historyData.value.multiplier;
      high += historyData.value.highs[i]! * historyData.value.multiplier;
      low += historyData.value.lows[i]! * historyData.value.multiplier;
      close += historyData.value.closes[i]! * historyData.value.multiplier;

      if (count == calculateTimeframe(period.value)) {
        data.push(bar!);
        bar = null;
        count = 0;
      }

      if (count == 0) {
        bar = {
          timestamp:
            historyData.value.timestamp +
            historyData.value.times[i]! *
              i *
              historyData.value.shift,
          open,
          close,
          low,
          high,
          volume: historyData.value.volumes[i],
        };
        lasttime.value = bar.timestamp;
      } else {
        bar = {
          ...bar!,
          high: Math.max(bar!.high, high),
          low: Math.min(bar!.low, low),
          close: close,
        };
      }
      count++;
    }
    data.push(bar!);
    allData = [...data, ...allData];

    currentTimestamp -= 24 * 60 * 60 * 1000; // Move to the previous day
  }

  return allData;
};

export const computeInitialChartData = async (): Promise<KLineData[]> => {
  const [from, to] = adjustFromTo(period.value, chartTimestamp.value, 500);

  if (from === undefined || to === undefined) {
    console.error('Invalid range: from or to is undefined');
    return [];
  }

  return await fetchAndProcessData(from, to);
};

export const loadMoreData = async (timestamp: number | null) => {
  console.info(`load more data called ${timestamp}`);
  if (!chart.value) return;

  if (!timestamp) timestamp = dayjs().valueOf();

  const [from, to] = adjustFromTo(period.value, timestamp, 500);

  if (from === undefined || to === undefined) {
    console.error('Invalid range: from or to is undefined');
    return;
  }

  const allData = await fetchAndProcessData(from, to);
  chart.value.applyMoreData(allData, true);
};