/* eslint-disable */

Moralis.Cloud.beforeSave('DripTransfers', (request) => {
  // const logger = Moralis.Cloud.getLogger()
  const block_timestamp = request.object.get('block_timestamp')
  request.object.set('block_timestamp', new Date(block_timestamp))
  
})
