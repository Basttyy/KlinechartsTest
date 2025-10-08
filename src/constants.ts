import { ref, type Ref } from "vue"
import type { Period } from "./types"
import type { Overlay, Chart, Nullable } from "@basttyy/klinecharts"
import dayjs from "./dayjs";

export const options: RequestInit = {
  method: 'GET',
  credentials: "include",
  'mode': 'cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Device_Id': 'sldlfjiwieuuew9eff89ewjwknjkekskfskjlsdk;fkdjskfdkjdkdks',
  }
}

export const base_url = `${import.meta.env.VITE_APP_DATA_URL as string}/dukascopy-data/v1/candles`

export const chartContainer = ref() as Ref<HTMLDivElement>
export const bottombarHeight = 70

export const windowHeight = ref(window.innerHeight)
export const windowWidth = ref(window.innerWidth)
export const topbar = ref(50); // Fixed height for topbar
export const bottombar = ref(0); // Fixed height for bottombar
export const chartHeight = ref(windowHeight.value - topbar.value - bottombar.value); // Initial height for chartContainer

export const overlayIds = ref<Number[]>([])

export const showExitConfirmation = ref(false);
export const historyData = ref<{
  timestamp: number,
  multiplier: number,
  open: number,
  high: number,
  low: number,
  close: number,
  shift: 60000,
  times: number[],
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
}>()

export const period = ref<Period>({
  multiplier: 15,
  text: '15min',
  timespan: 'minute'
})

export const lasttime = ref(0)
export const chartTimestamp = ref(dayjs().subtract(1, 'day').valueOf())
export const replayOverlay = ref<Nullable<Overlay>>(null)
export const chart = ref<Nullable<Chart>>()