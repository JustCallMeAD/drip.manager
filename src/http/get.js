import axios from 'axios'

export default async function get(url, params) {
  try {
    const encodedUrl = encodeURI(url + (params ? '?' + params : params))
    const response = await axios.get(encodedUrl)
    console.log(response)
    return response
  } catch (e) {
    console.log(e.message)
  }
}
