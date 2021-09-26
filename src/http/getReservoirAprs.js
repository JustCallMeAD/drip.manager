import get from './get'
import * as URLS from './hard-coded-urls.js'

export default async function getReservoirAprs() {
  return await get(
    URLS.DRIP_API_URL + 'queryReservoirAprs'
  )
}
