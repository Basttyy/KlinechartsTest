// utils/dayjs.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isoWeek from 'dayjs/plugin/isoWeek';
// import dayOfYear from 'dayjs/plugin/dayofyear';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
// dayjs.extend(dayOfYear)

export default dayjs