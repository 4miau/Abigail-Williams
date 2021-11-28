import axios from 'axios'
import { envs } from '../../client/Components'

export async function _DanbooruAuthorize() {
    try {
        const booruProfile = await axios.get(`https://danbooru.donmai.us/profile.json?login=${envs.danbooruUsername}&api_key=${envs.danbooruAPIKey}`).then(res => res.data)
        return booruProfile ? booruProfile : null
    } catch {
        return null
    }
}

export async function _GetBooruImages(query, amount = 150) {
    const tags = `&limit=${amount}&order=random&rating=safe`
    const rawSearch = `https://danbooru.donmai.us/posts.json?tags=${query === null || query === void 0 ? void 0 : query.replaceAll(' ', '_')}`

    try {
        const booruImages = await axios.get(rawSearch + tags)
            .then(res => res.data.filter((r) => r && (r?.large_file_url || r?.file_url)))
            .catch(() => void 0)

        return booruImages ? booruImages.arrayRandom() : null
    } catch {
        return null
    }
}