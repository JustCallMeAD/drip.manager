/* eslint-disable */

const getDripStore = async () => {
    const firstBlock = 6736460
    const DripStore = Moralis.Object.extend('DripStore')
    const query = new Moralis.Query(DripStore)
  
    const results = await query.find()
    if (results.length == 0) {
      const dripStore = new DripStore()
      dripStore.set('lastBlock', firstBlock)
      return await dripStore.save()
    }
  
    return results[0]
  }