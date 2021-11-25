import axios from 'axios'

import { envs } from '../../client/Components'

export async function _GetTwitterUser(twitterUsername: string): Promise<any> {
    try {
        const user = await axios.get(`https://api.twitter.com/2/users/by/username/${twitterUsername}?user.fields=pinned_tweet_id,description&expansions=pinned_tweet_id&tweet.fields=created_at`, {
            headers: {
                'Authorization': `Bearer ${envs.twitterToken}`
            }
        })
        .then(res => res.data)
        
        return user ? user : null
    } catch {
        return null
    }
}

export async function _GetUserLatestPosts(twitterUserID: string): Promise<any> {
    try {
        const timeline = await axios.get(`https://api.twitter.com/2/users/${twitterUserID}/tweets?&expansions=attachments.media_keys,in_reply_to_user_id&media.fields=media_key,url`, {
            headers: {
                'Authorization': `Bearer ${envs.twitterToken}`
            }
        })
        .then(res => res.data)

        return timeline ? timeline : null
    } catch {
        return null
    }
}

//TODO: WIP