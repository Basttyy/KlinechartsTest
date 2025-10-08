import { timespan, type days, type Period } from "./types"
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek';
import { bottombar, chart, chartContainer, chartHeight, chartTimestamp, replayOverlay, showExitConfirmation, topbar, windowHeight, windowWidth } from "./constants";
import { computeInitialChartData } from "./dataprocessor";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)

export const adjustFromTo = (period: Period, toTimestamp: number, count: number) => {
    switch (period.timespan) {
        case 'minute': {
            toTimestamp = dayjs.utc(toTimestamp).subtract(1, 'day').valueOf()
            break
        }
        case 'hour': {
            toTimestamp = dayjs.utc(toTimestamp).subtract(1, 'month').valueOf()
            break
        }
        case 'day':
        case 'week':
        case 'month':
        case 'year':
            toTimestamp = dayjs.utc(toTimestamp).subtract(1, 'year').valueOf()
    }
    let to = toTimestamp
    let from = to
    switch (period.timespan) {
        case 'minute': {
            to = to - (to % (60 * 1000))
            from = to - count * period.multiplier * 60 * 1000
            break
        }
        case 'hour': {
            to = to - (to % (60 * 60 * 1000))
            from = to - count * period.multiplier * 60 * 60 * 1000
            break
        }
        case 'day': {
            to = to - (to % (60 * 60 * 1000))
            from = to - count * period.multiplier * 24 * 60 * 60 * 1000
            break
        }
        case 'week': {
            const date = new Date(to)
            const week = date.getDay()
            const dif = week === 0 ? 6 : week - 1
            to = to - dif * 60 * 60 * 24
            const newDate = new Date(to)
            to = new Date(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`).getTime()
            from = count * period.multiplier * 7 * 24 * 60 * 60 * 1000
            break
        }
        case 'month': {
            const date = new Date(to)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            to = new Date(`${year}-${month}-01`).getTime()
            from = count * period.multiplier * 30 * 24 * 60 * 60 * 1000
            const fromDate = new Date(from)
            from = new Date(`${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-01`).getTime()
            break
        }
        case 'year': {
            const date = new Date(to)
            const year = date.getFullYear()
            to = new Date(`${year}-01-01`).getTime()
            from = count * period.multiplier * 365 * 24 * 60 * 60 * 1000
            const fromDate = new Date(from)
            from = new Date(`${fromDate.getFullYear()}-01-01`).getTime()
            break
        }
    }
    return [from, to]
}

export function getIsoYearMonthWeekDay(timestamp: string | number | Date, timezone: string = 'Etc/UTC'): {
    dayOfWeek: days,
    dayOfMonth: number,
    weekOfYear: number,
    monthOfYear: number,
    year: number
} {
    const daysOfWeek: days[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dt = dayjs.tz(timestamp, timezone)
    const weekDay = dt.day()
    const date = dt.date()
    const week = dt.isoWeek()
    const month = dt.month() + 1
    const year = dt.year()

    return {
        dayOfWeek: daysOfWeek[weekDay]!,
        dayOfMonth: date,
        weekOfYear: week,
        monthOfYear: month,
        year: year
    };
}

export const calculateTimeframe = (period: Period) => {
    return period.multiplier * timespan[period.timespan]
}

export const exit = async () => {
    console.log('Exiting...');
    showExitConfirmation.value = false;
    chartTimestamp.value = dayjs().subtract(1, 'day').valueOf()

    if (chart.value) {
        const initialData = await computeInitialChartData();
        chart.value.applyNewData(initialData, true);
    }
    bottombar.value = 0
    updateSize()
    replayOverlay.value = null
    // Add logic to handle exit
};

export const cancelExit = () => {
    showExitConfirmation.value = false;
};

export function updateSize() {
    console.info('update size called')
    // const oldHeight = windowHeight.value
    windowHeight.value = window.innerHeight
    windowWidth.value = window.innerWidth
    // topbar.value = (windowHeight.value / oldHeight) * topbar.value
    chartHeight.value = window.innerHeight - topbar.value - bottombar.value - 5

    chartContainer.value.firstElementChild!.setAttribute('style', `
		height: ${chartHeight.value}px;
		width: 100%;
	`)
    chart.value?.resize()
}