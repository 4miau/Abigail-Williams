# abby-bot ©

- [Abby-bot](#abby-bot)
  - [Description](#description)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Commands](#commands)
  - [Note](#note)

# Description

abby-bot is a private work-in-progress multi-purpose discord bot with the main focus tied towards modmail. Although modmail will be the primary focus of the bot, it will still contain many features in the future, and will serve for moderation, giveaways, the ability to post youtube videos, twitch streams & twitter posts, and so on.

Also please read the note towards the bottom in case you are wondering whether you can make contributions to help me complete the bot, or if you have an issue with how the code is (whether it's impractical/inefficient).

# Features
(PS: these are features to come, and have not yet been implemented as the bot is WIP)
---

### ___Modmail___

#### Modmail will allow members to DM the bot when they require support in a server, and having a thread opened inside a discord where the person who requires support interacts to staff/support by DM'ing the bot while staff/support send their replies via the thread opened. It will be simple to set up, contain a lot of configuration for the staff to customise how threads are set up, how they are closed, and how they are managed while open.

### ___Moderation___

#### abby-bot will have a lot of moderation commands with many possible arguments, making it easy for staff and moderators to be able to have an easier life when handling with moderation, there'll be a lot of configuration such as setting up mute roles and mod roles.

### ___Giveaways___

#### Users will be able to dynamically set up giveaways, being able to choose the amount of winners that are picked out. I may possibly decide to make benefits, in which people with set roles will be able to have double/triple their entries, allowing them to have higher chances of winner with the ability to configure which roles these will apply to.

### ___Platform Promotion___

#### This is a feature I believe will take a while but will be very much worth it, abby-bot will post: Youtube, Twitch & Twitter posts a while after specific channels, streamers or users produce content. As to who will be able to be configured and will dynamically use APIs to check whenever a post is made and update it in a determined discord text channel.

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
</ul>

<ul>
  <li>Discord.js latest version is recommended</li>
</ul>

```diff
# You can install this by running "npm i discord.js in your terminal"
```

Optionally:
<ul>
  <li>sqlite3 (if you wish to use sqlite for the database)</li>
  <li>typeorm (this is useful for storing connections and repositories while connecting to db)</li>
  <li></li>
</ul>

# Commands

Here are a list of the current commands (only those that are functional):
###### NOTE: I have decided to leave out the Owner commands, however I can tell you they are all functional with decent error handling (requires optimization)
---
## Fun:

<ul>
  <li>Russian Roulette (rr)</li>
  <li>8ball</li>
</ul>

## General:

## Configuration:
<ul>
  <li>SetMuteRole</li>
</ul>

## Moderation:

<ul>
  <li>Fixname</li>
  <li>Slowmode (requires optimization)</li>
  <li>Warn</li>
  <li>Kick</li>
  <li>Unban</li>
  <li>Ban</li>
</ul>

## Utility

<ul>
  <li>Ping</li>
  <li>Avatar</li>
</ul>

# Note

##### While it is true that this bot's code (commands, listeners & inhibitors, etc) is open to the public, you may use the coding from this bot to study & learn from, especially if you are using typescript, or the discord-akairo framework.
###### However, you may not invite this bot to other servers, as it is private and you will have to figure out how to host the bot and make a database yourself. You can not just directly dump this program to make your bot, you will need to have some understanding on how to use Node.js.


###### Bonus note: sorry if the code seems impractical, I am actually currently learning Typescript at the same time so this is an opportunity for me to learn also. Feel free to make pull requests to help out, I will review every pull request.
