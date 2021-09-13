import get from './get'
import * as URLS from './hard-coded-urls.js'

export default async function getDepositCounts(ranges) {
  return await get(URLS.DRIP_API_URL + 'queryDeposits', 'ranges=' + JSON.stringify(ranges))
}
