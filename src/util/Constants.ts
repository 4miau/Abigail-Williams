//*COMMANDS

/*
    FUN
*/

//8ball

export const eightBallReplies: string[] = [
    'Yes', 'No', 'Maybe', 'Probably', 'Probably not', 'It is certain, yes', 'I can tell you certainly, no', 'Without a doubt, yes', 'Definitely', 'Definitely not',
    'Ask again later', 'Try again later', 'It is likely', 'It is unlikely', 'Fortunately, yes', 'Unfortunately, no', 'I have decided it is so', 'I have decided it is not',
    'Without a doubt', 'I am uncertain', 'I can not be sure about that', 'If charlie says so, yes'
]

//rr

export const bulletsMin: number = 1
export const bulletsMax: number = 5
export const bulletsTotal: number = 6

export const emojiList: string[] = [
    ':grinning:', ':grimacing:', ':joy:', ':smiley:', ':smile:', ':wink:', ':fearful:', ':persevere:', ':confounded:', ':tired_face:', ':triumph:', ':flushed:',
    ':neutral_face:', ':expressionless:', ':mask:', ':sob:', ':sleepy:'
]

export const deadList: string[] = [
    'I guess you didn\'t have any luck today.',
    'sometimes it is just one of those days.',
    'and you are dead!',
    'rest in peace, my friend.',
    'guns are very dangerous!',
    'that\'s a lot of blood...',
    'I think there was some lag there...blame that.',
    'rr seems to be rigged!!!'
]

export const liveList: string[] = [
    'silence fills the air...you get to live another day.',
    'you look pretty smug for almost dying!',
    'you breathe a sigh of relief, realising you get have survived another day',
    'you are one lucky man.',
    'I was kind of expecting a big bang.',
    'of course you survived, you are MLG!'
]

/*
    GENERAL
*/

//Help

export const commandsGithub: string = 'https://github.com/notmiauu/abby-bot#commands'

export const pages: readonly number[] = [1, 2] 

/*
    GAMES
*/

export const legendHeader = {
    'Wraith' : 'https://i.imgur.com/yRjWyHu.png',
    'Loba': 'https://i.imgur.com/6Z9ccJQ.png',
    'Caustic': 'https://i.imgur.com/vzIWTIv.jpg',
    'Bangalore': 'https://i.imgur.com/Ak6d3S7.jpg',
    'Mirage': 'https://i.imgur.com/f5d1Kco.jpg',
    'Wattson': 'https://i.imgur.com/8piOEse.png',
    'Rampart': 'https://i.imgur.com/Q7ex72r.jpg',
    'Horizon': 'https://i.imgur.com/cyFCQbj.jpg',
    'Valkyrie': 'https://i.imgur.com/VqRmJTK.jpg',
    'Crypto': 'https://i.imgur.com/XNU6S04.jpg',
    'Pathfinder': 'https://i.imgur.com/uyRmSHh.jpg',
    'Revenant': 'https://i.imgur.com/22XJPph.jpg',
    'Bloodhound': 'https://i.imgur.com/ZxXTaQA.jpg',
    'Octane': 'https://i.imgur.com/dcQRJjq.jpg',
    'Lifeline': 'https://i.imgur.com/RyjVl6t.jpg',
    'Gibraltar': 'https://i.imgur.com/NvMRNuo.jpg',
    'Fuse': 'https://i.imgur.com/ckMAUri.jpg'
}

/*
    MODERATION
*/

//Fixname

export const fixnameMax: number = 9999

//Slowmode

export const slowmodeRange: number[] = [0, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600] //ms -> s
export const secondsConvert: number = 1000

//Mute

export const minMuteTime: number = 6e3 //1 Minute
export const maxMuteTime: number = 2.6e9 //30 DAYS

//Prune

export enum flags {
    'text' = 1,
    'bots',
    'images',
    'embeds',
    'mentions',
    'links',
    'invites',
    'left',
    'member'
}

/*
    CONFIGURATION
*/

export const deleteLogFlags = ['-d', '-delete']
export const editLogFlags = ['-e', '-edit']

/*
    TWITCH
*/

export const streamDefaultMessage: string = `{streamer} has gone live! {link}`


/*
    MISC
*/

export const ZERO: number = 0
export const ONE: number = 1

export const changeLog: string[] = [
    '[ADD] Music commands',
    '[ADD] Softban with efficient error handling',
    '[FIX] Giveaways no longer stops the bot',
    '[UPD] Can play more songs, increased node process limit',
    '[FIX] Fixed bunny image API (still API dependent)',
    '[UPD] More Apex Legends data is displayed now, still more to come.',
    '[FIX] Help command now loads faster',
    '[FIX] API-based commands are slightly faster.',
    '[ADD] New feedback command, help me so I can upgrade!',
]


//8.64e7 //1 DAY
//2.6e9 //30 DAYS

//* LISTENERS

/*
    MESSAGE
*/

export const inviteDetection: string[] = ['discord.gg/', 'discord.gg', 'gg/', 'discordapp.com/invite/', '.gg/', '. gg/', 'gg /', 'gg /']