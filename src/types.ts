export type days = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export interface SymbolInfo {
  ticker: string
  name?: string
  shortName?: string
  exchange?: string
  market?: string
  pricePrecision?: number
  volumePrecision?: number
  priceCurrency?: string
  dollarPerPip?: number
  type?: string
  logo?: string
}

export interface Period {
  multiplier: number
  timespan: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  text: string
}

export const timespan = {
    minute : 1,
    hour : 60,
    day : 1440,
    week : 7200,
    week_end : 10080,
    // month : 43829,
    // year : 525600,
    month : 43829,
    year : 525948
}