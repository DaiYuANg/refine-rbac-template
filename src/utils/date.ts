/**
 * Date utilities built on dayjs.
 * Centralize date parsing, formatting, and common operations.
 * Default locale: zh-cn (中文).
 */
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export { dayjs, type Dayjs }

/** Common display formats */
export const DATE_FORMATS = {
  /** 2025-03-23 */
  date: 'YYYY-MM-DD',
  /** 2025-03-23 14:30:00 */
  datetime: 'YYYY-MM-DD HH:mm:ss',
  /** 14:30 */
  time: 'HH:mm',
  /** 2025年3月23日 */
  dateZh: 'YYYY年M月D日',
  /** 2025年3月23日 14:30 */
  datetimeZh: 'YYYY年M月D日 HH:mm',
} as const

export type DateFormatKey = keyof typeof DATE_FORMATS

/**
 * Format a date value for display.
 * Accepts Date, string (ISO), number (timestamp), or Dayjs.
 */
export function formatDate(
  value: Date | string | number | Dayjs | null | undefined,
  format: DateFormatKey | string = 'date'
): string {
  if (value == null) return ''
  const d = dayjs(value)
  return d.isValid()
    ? d.format(DATE_FORMATS[format as DateFormatKey] ?? format)
    : ''
}
