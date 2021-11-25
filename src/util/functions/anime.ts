import axios from 'axios'

export async function _GetAnimeSFW(category: string): Promise<any> {
    try { return await axios.get(`https://api.waifu.pics/sfw/${category}`).then(res => res.data).catch(() => void 0) }
    catch { return null }
}