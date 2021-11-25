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

### ___Modmail___

#### Modmail will allow members to DM the bot when they require support in a server, and having a thread opened inside a discord where the person who requires support interacts to staff/support by DM'ing the bot while staff/support send their replies via the thread opened. It will be simple to set up, contain a lot of configuration for the staff to customise how threads are set up, how they are closed, and how they are managed while open.

### ___Moderation___

#### abby-bot will have a lot of moderation commands with many possible arguments, making it easy for staff and moderators to be able to have an easier life when handling with moderation, there'll be a lot of configuration such as setting up mute roles and mod roles. You will also be able to determine where modlogs should be posted dynamically.

### ___Giveaways___

#### Users will be able to dynamically set up giveaways, being able to choose the amount of winners that are picked out. I may possibly decide to make benefits, in which people with set roles will be able to have double/triple their entries, allowing them to have higher chances of winner with the ability to configure which roles these will apply to.

### ___Platform Promotion___

#### This is a feature I believe will take a while but will be very much worth it, abby-bot will post: Youtube, Twitch & Twitter posts a while after specific channels, streamers or users produce content. As to who will be able to be configured and will dynamically use APIs to check whenever a post is made and update it in a determined discord text channel.

### ___Automoderation___

#### Users will be able to enable automoderation to make server moderating easier, this will handle: everyone pings, mass-mentioning, invite links/possible promoting, maximum lines, maximum emojis, spam

#### There are many, many features that will also be implemented, are work in progress or have been implemented such as: starboard, reminders, images, game data (e.g. Apex Legends, League of Legends), economy, minigames, etc. This will take a long time to make but is very well a nice project!

# Requirements
---

These are some simple requirements you will need in order to host the bot, however I will not provide a guide as to how to do so.

<ul>
  <li>node.js v16.7 or greater is recommended</li>
  <li>typescript</li>
  <li>discord-akairo</li>
</ul>

```diff
# You can install this by running "npm i discord-akairo/discord-akairo in your terminal"
```

<ul>
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
  <li>dotenv</li>
</ul>

```diff
# You can install this by running "npm i dotenv in your terminal"
```

<ul>
  <li>@discordjs/opus</li>
  <li>discord-music-player</li>
  <li>glob</li>
  <li>moment (very useful for working with dates and formatting date strings)</li>
  <li>mongoose</li>
</ul>

Optionally:
<ul>
  <li>canvas</li>
  <li>jest (dependency, for unit testing)</li>
  <li>jimp</li>
  <li>node-emoji</li>
  <li>node-myanimelist</li>
  <li>ripemd160 (for hashing) </li>
  <li>ts-jest (dependency, for unit testing)</li>
  <li>winston (for logging)</li>
</ul>

# Commands

**Due to the massive list of commands, I have moved the location of commands towards the bottom, you can quickly be redirected [here](#list-of-commands)**

# Contributing

### For those that wish to contribute to the bot, it'd be greatly appreciated. If you wish to contribute then please proceed with the following steps:

- Fork this repository
- Create a new branch hosting the changes `git checkout -b new-branch`
- After making updates to this branch, push it to your forked repository `git push remote new-branch`
- `Submit a pull request` with a summary of the changes/features added
<br>
  
**[⬆ Back to the top](#description)**

# Author

#### Hi there!  <img src="https://i.imgur.com/yyb4WpE.png" align="right" width=128>
abby-bot ©️ [miau](https://github.com/4miau)
Solely authored and maintained by miau.

### Note

##### I shall permit this bot's code to be used to study & learn from. However, to host the bot, you will have to figure out how to recreate certain files, host the bot and make a database yourself. You can not just directly dump this repository in order to make your bot, you will need to have decent understanding with discord-akairo (read the docs) & node.js.

##### I would like to give credit to iCrawl as the case system is influenced by him (specifically Case.ts, MuteManager.ts, Cases.ts & ModUtil.ts). I was thinking for quite a long while as to how to approach this system for the most efficient way to get, display & store moderation cases/logs. He's quite the genius.

##### I would like to apologise if my code is not ideal, or great. I am currently learning TypeScript. I appreciate all contributions, whether it is for addition of features of to clean existing code. If it is to clean code please specify the name of the file and the line it is meant to start from.

# List of Commands

#### Here are a list of the current commands (only those that are functional and excludes owner & developer):

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
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Anime:
<ul>
  <li>Anime</li>
  <li>AnimeQuote</li>
  <li>Manga</li>
  <li>Neko</li>
  <li>Waifu</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Automation:
<ul>
  <li>AntiEveryone</li>
  <li>AntiInvite</li>
  <li>AntiSpam</li>
  <li>AntiSpamWhitelist</li>
  <li>MaxLines</li>
  <li>MaxMentions</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Configuration:
<ul>
  <li>AddEmote</li>
  <li>ChannelBlacklist</li>
  <li>ChannelWhitelist</li>
  <li>EditGiveaway</li>
  <li>EndGiveaway</li>
  <li>Giveaway</li>
  <li>Ignore</li>
  <li>LeaveMessage</li>
  <li>RemoveEmote</li>
  <li>ResetCount</li>
  <li>SetAutoRole</li>
  <li>SetBotNotice</li>
  <li>SetCountChannel</li>
  <li>SetModmailChannel</li>
  <li>SetPrefix</li>
  <li>SetStaffRole</li>
  <li>SetSuggestChannel</li>
  <li>SetSupportRole</li>
  <li>Setup</li>
  <li>SetWarnThreshold</li>
  <li>SetWelcomeChannel</li>
  <li>Unsetup</li>
  <li>UserBlacklist</li>
  <li>UserWhitelist</li>
  <li>WelcomeMessage</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Fun:
<ul>
  <li>8ball</li>
  <li>Coinflip</li>
  <li>Gayrate</li>
  <li>Russian Roulette (rr)</li>
  <li>Say</li>
  <li>Ship</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Games:
<ul>
  <li>ApexLegends</li>
  <li>GameInfo</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## General:
<ul>
  <li>About</li>
  <li>Changelog</li>
  <li>Feedback</li>
  <li>Help</li>
  <li>MemberCount</li>
  <li>Report</li>
  <li>Snipe</li>
  <li>Suggest</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Images:
<ul>
  <li>Bunny</li>
  <li>Cat</li>
  <li>Dog</li>
  <li>Duck</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Logging:
<ul>
  <li>SetAllLogs</li>
  <li>SetChannelLog</li>
  <li>SetGuildLog</li>
  <li>SetMessageLog</li>
  <li>SetModlog</li>
  <li>SetRoleLog</li>
  <li>SetUserLog</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

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
  <li>Massban</li>
  <li>Mute</li>
  <li>Pardon</li>
  <li>Prune</li>
  <li>Reason</li>
  <li>SetMuteRole</li>
  <li>SetNickname</li>
  <li>SetRole</li>
  <li>Slowmode</li>
  <li>Softban</li>
  <li>Unban</li>
  <li>Unmute</li>
  <li>Voiceban</li>
  <li>Warn</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Modmail
<ul>
  <li>Contact</li>
  <li>StartThread</li>
</ul>
<br>

**[⬆ Back to Commands](#list-of-commands)**

## Music
<ul>
  <li>ClearQueue</li>
  <li>Connect</li>
  <li>Disconnect</li>
  <li>Loop</li>
  <li>NowPlaying</li>
  <li>Pause</li>
  <li>Play</li>
  <li>Queue</li>
  <li>Resume</li>
  <li>Search</li>
  <li>Seek</li>
  <li>SetDJRole</li>
  <li>Shuffle</li>
  <li>Skip</li>
  <li>Volume</li>
</ul>
<br>

**[⬆ Back to Commands](#list-of-commands)**

## Reaction Roles
<ul>
  <li>AddIgnoredRole</li>
  <li>AddReactRole</li>
  <li>AddRequiredRole</li>
  <li>CreateRoleGroup</li>
  <li>DeleteRoleGroup</li>
  <li>ManageRoleGroup</li>
  <li>RemoveIgnoreRole</li>
  <li>RemoveReactRole</li>
  <li>RemoveRequiredRole</li>
  <li>RoleGroups</li>
  <li>RoleMenu</li>
</ul>
<br>

**[⬆ Back to Commands](#list-of-commands)**

## Starboard
<ul>
  <li>FixStar</li>
  <li>ResetStars</li>
  <li>Star</li>
  <li>StarboardBlacklist</li>
  <li>StarboardSetChannel</li>
  <li>StarboardThreshold</li>
  <li>StarboardWhitelist</li>
  <li>StarConfig</li>
  <li>StarEmoji</li>
  <li>Unstar</li>
</ul>
<br>

**[⬆ Back to Commands](#list-of-commands)**

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
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Twitter
<ul>
  <li>AddTwitterUser</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Utility
<ul>
  <li>Avatar</li>
  <li>Donators</li>
  <li>GuildIcon</li>
  <li>Mods</li>
  <li>Ping</li>
  <li>Roles</li>
  <li>Userinfo</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**

## Verification
<ul>
  <li>SetUnverifiedRole</li>
  <li>SetVerificationChannel</li>
  <li>SetVerifiedRole</li>
  <li>Verify</li>
</ul>
<br>
  
**[⬆ Back to Commands](#list-of-commands)**
