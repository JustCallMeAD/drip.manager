import get from './get'
import * as URLS from './hard-coded-urls.js'

export default async function getReservoirHistory(address) {
  return await get(
    URLS.DRIP_API_URL + 'queryReservoirHistory',
    'address=' + address
  )
}
