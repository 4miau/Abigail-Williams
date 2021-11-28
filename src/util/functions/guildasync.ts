import axios from 'axios'

export async function getUserData(userID: string) {
    try {
        const userData = await axios.get(`https://dislookup.am2i9.ml/api/user/${userID}`).then(res => res.data)
        return userData ? userData : null
    } catch {
        return null
    }
}