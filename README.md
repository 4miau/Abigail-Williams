# Abigail Williams (AKA. abby-bot) 

- [Abby-bot](#abby-bot) <img src="https://i.imgur.com/yyb4WpE.png" align="right" width=200>
  - [Description](#description)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Commands](#commands)
  - [Contributing](#contributing)
  - [Author](#author)

# Description

abby-bot is a private work-in-progress multi-purpose discord bot with the main focus tied towards modmail. Although modmail will be the primary focus of the bot, it will still contain many features in the future, and will serve for moderation, giveaways, the ability to post youtube videos, twitch streams & twitter posts, and so on.

Also please read the note towards the bottom in case you are wondering whether you can make contributions to help me complete the bot, or if you have an issue with how the code is (whether it's impractical/inefficient).

# Features
(PS: these are features to come, and have not yet been implemented as the bot is WIP)
---

### ___Modmail___ (5%)

#### Modmail will allow members to DM the bot when they require support in a server, and having a thread opened inside a discord where the person who requires support interacts to staff/support by DM'ing the bot while staff/support send their replies via the thread opened. It will be simple to set up, contain a lot of configuration for the staff to customise how threads are set up, how they are closed, and how they are managed while open.

### ___Moderation___ (85%)

#### abby-bot will have a lot of moderation commands with many possible arguments, making it easy for staff and moderators to be able to have an easier life when handling with moderation, there'll be a lot of configuration such as setting up mute roles and mod roles. You will also be able to determine where modlogs should be posted dynamically.

### ___Giveaways___ (80%)

#### Users will be able to dynamically set up giveaways, being able to choose the amount of winners that are picked out. I may possibly decide to make benefits, in which people with set roles will be able to have double/triple their entries, allowing them to have higher chances of winner with the ability to configure which roles these will apply to.

### ___Platform Promotion___ (35%)

#### This is a feature I believe will take a while but will be very much worth it, abby-bot will post: Youtube, Twitch & Twitter posts a while after specific channels, streamers or users produce content. As to who will be able to be configured and will dynamically use APIs to check whenever a post is made and update it in a determined discord text channel.

### ___Automoderation___ (10%)

#### Users will be able to enable automoderation to make server moderating easier, this will handle: everyone pings, mass-mentioning, invite links/possible promoting, maximum lines, maximum emojis, spam

#### There are many, many features that will also be implemented, are work in progress or have been implemented such as: starboard, reminders, images, game data (e.g. Apex Legends, League of Legends), economy, minigames, etc. This will take a long time to make but is very well a nice project!

# Requirements
---

These are just some simple requirements you will need in order to host the bot, however I will not provide a guide as to how to do so.

<ul>
  <li>Node.js v14 or greater is recommended</li>
  <li>Typescript</li>
  <li>discord-akairo</li>
</ul>

```diff
# You can install this by running "npm i 1Computer1/discord-akairo in your terminal"
```

<ul>
  <li>@types/node</li>
  <li>Discord.js latest version is recommended</li>
</ul>

```diff
# You can install this by running "npm i discord.js in your terminal"
```

<ul>
  <li>axios</li>
</ul>

```diff
# You can install this by running "npm i axios in your terminal"
```

<ul>
  <li>erela.js</li>
  <li>typescript</li>
  <li>undici</li>
  <li>node-abort-controller (for music)</li>
<ul>

Optionally:
<ul>
  <li>sqlite3 (if you wish to use sqlite for the database)</li>
  <li>typeorm (this is useful for storing connections and repositories while connecting to db)</li>
  <li>dot-prop (useful for SettingsProvider)</li>
  <li>winston (logging purposes, more efficient than console logging)</li>
  <li>moment (very useful for working with dates and formatting date strings)</li>
  <li>common-tags (useful for working with new lines on string literals, without using '\n')</li>
  <li>erela.js-spotify</li>
</ul>

# Commands

#### Here are a list of the current commands (only those that are functional):
---

## Action:
<ul>
  <li>Bite</li>
  <li>Blush</li>
  <li>Bonk</li>
  <li>Bully</li>
  <li>Cringe</li>
  <li>Cry</li>
  <li>Cuddle</li>
  <li>Dance</li>
  <li>Happy</li>
  <li>HighFive</li>
  <li>HoldHand</li>
  <li>Hug</li>
  <li>Kill</li>
  <li>Kiss</li>
  <li>Lick</li>
  <li>Nom</li>
  <li>Pat</li>
  <li>Poke</li>
  <li>Slap</li>
  <li>Smile</li>
  <li>Smug</li>
  <li>Wave</li>
  <li>Wink</li>
  <li>Yeet</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Anime:
<ul>
  <li>AnimeQuote</li>
  <li>Neko</li>
  <li>Waifu</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Automod:
<ul>
  <li>AntiEveryone</li>
  <li>AntiInvite</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Configuration:
<ul>
  <li>ChannelBlacklist</li>
  <li>ChannelWhitelist</li>
  <li>MessageLogs</li>
  <li>SetModmailChannel</li>
  <li>SetMuteRole</li>
  <li>SetPrefix</li>
  <li>SetStaffRole</li>
  <li>SetSuggestChannel</li>
  <li>SetSupportRole</li>
  <li>Setup</li>
  <li>SetWarnThreshold</li>
  <li>UserBlacklist</li>
  <li>UserWhitelist</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Fun:
<ul>
  <li>8ball</li>
  <li>Coinflip</li>
  <li>Gayrate</li>
  <li>Russian Roulette (rr)</li>
  <li>Say</li>
  <li>Ship</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Games:
<ul>
  <li>ApexLegends</li>
</ul>

**[⬆ Back to Commands](#commands)**

## General:
<ul>
  <li>About</li>
  <li>Changelog</li>
  <li>EndGiveaway</li>
  <li>Feedback</li>
  <li>Giveaway</li>
  <li>Help</li>
  <li>Snipe</li>
  <li>Suggest</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Images:
<ul>
  <li>Bunny</li>
  <li>Cat</li>
  <li>Danbooru (WIP)</li>
  <li>Dog (outdated API)</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Moderation:
<ul>
  <li>Ban</li>
  <li>Banlist</li>
  <li>Cases</li>
  <li>Clean</li>
  <li>CreateRole</li>
  <li>DeleteRole</li>
  <li>Fixname</li>
  <li>Kick</li>
  <li>ManageRole</li>
  <li>Mute</li>
  <li>Pardon</li>
  <li>Prune</li>
  <li>SetNickname</li>
  <li>SetRole</li>
  <li>Slowmode</li>
  <li>Softban</li>
  <li>Unban</li>
  <li>Unmute</li>
  <li>Warn</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Twitch
<ul>
  <li>AddStreamer</li>
  <li>AddStreamerPing</li>
  <li>RemoveStreamer</li>
  <li>RemoveStreamerPing</li>
  <li>StreamerPings</li>
  <li>Streamers</li>
  <li>TwitchFeedChannel</li>
  <li>TwitchSetMessage</li>
</ul>

*Note: TwitchSetMessage is PER streamer, same with AddStreamerPing for customisability and for it to be more dynamic.*

**[⬆ Back to Commands](#commands)**

## Twitter
<ul>
  <li>AddTwitterUser</li>
</ul>

**[⬆ Back to Commands](#commands)**

## Utility
<ul>
  <li>Avatar</li>
  <li>Mods</li>
  <li>Ping</li>
  <li>Roles</li>
  <li>Uptime</li>
  <li>Userinfo</li>
</ul>

**[⬆ Back to Commands](#commands)**

# Contributing

### For those that wish to contribute to the bot, it'd be greatly appreciated. If you wish to contribute then please proceed with the following steps:

- Fork this repository
- Create a new branch hosting the changes `git checkout -b new-branch`
- After making updates to this branch, push it to your forked repository `git push remote new-branch`
- `Submit a pull request` with a summary of the changes/features added

**[⬆ Back to the top](#description)**

# Author

#### Hi there!  <img src="https://i.imgur.com/yyb4WpE.png" align="right" width=128>
abby-bot ©️ [miau](https://github.com/notmiauu)
Solely authored and maintained by miau.

### Note

##### I shall permit this bot's code to be used to study & learn from. However, to host the bot, you will have to figure out how to recreate certain files, host the bot and make a database yourself. You can not just directly dump this repository in order to make your bot, you will need to have decent understanding with discord-akairo (read the docs) & Node.js.

##### I would like to give credit to iCrawl as the case system is influenced by him (specifically Case.ts, MuteManager.ts, Cases.ts & ModUtil.ts). I was thinking for quite a long while as to how to approach this system for the most efficient way to get, display & store moderation cases/logs. He's quite the genius.

##### I would like to apologise if my code is not ideal, or great. I am currently learning TypeScript. I appreciate all contributions, whether it is for addition of features of to clean existing code. If it is to clean code please specify the name of the file and the line it is meant to start from.
