import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const APP_TZ = process.env.TZ || 'Asia/Manila'

export const dayjsLocal = (date?: Date | string) => dayjs(date).tz(APP_TZ)
