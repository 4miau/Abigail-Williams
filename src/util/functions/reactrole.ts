import { User, Message, MessageReaction, GuildEmoji, ReactionEmoji } from 'discord.js'

import Abby from '../../client/Abby'

export function manageReactRole(option: ReactOptions, value: string, group: string, msg: Message) {
    const cli = msg.guild.client as Abby
    const reactionSettings: RoleGroup[] = cli.settings.get(msg.guild, 'reaction.role-groups', [])
    const groupIndex = reactionSettings.findIndex(rg => rg.groupName === group)

    if (groupIndex === -1) return 'Error: Unable to find this group.'

    switch (option) {
        case 'SINGLELOCK': {
            if (!(['true', 'false'].includes(value))) return 'Error: A valid value was not provided.'

            if (value === 'true') {
                if (reactionSettings[groupIndex].singleLock === true) return 'Error: Option is already enabled.'
                else {
                    reactionSettings[groupIndex].singleLock = true
                    cli.settings.set(msg.guild, 'reaction.role-groups', reactionSettings)
                    return 'Successfully enabled singlelock for this role group.'
                }
            } else {
                if (reactionSettings[groupIndex].singleLock === false) return 'Error: Option is already disabled.'
                else {
                    reactionSettings[groupIndex].singleLock = false
                    cli.settings.set(msg.guild, 'reaction.role-groups', reactionSettings)
                    return 'Successfully disabled singlelock for this role group.'
                }
            }
        }
        default:
            return 'Error: Invalid option given.'
    }
}

export async function reactAddEvent(reaction: MessageReaction, user: User) {
    const cli = reaction.client as Abby
    const gm = reaction.message.guild.members.resolve(user.id)

    const roleGroups: RoleGroup[] = cli.settings.get(reaction.message.guild, 'reaction.role-groups', [])
    if (roleGroups.arrayEmpty()) return false
    if (!roleGroups.find(rg => rg.messages.some(m => m.message === reaction.message.id))) return false

    const groupIndex = roleGroups.findIndex(rg => rg.messages.some(m => m.message === reaction.message.id))
    const messageIndex = roleGroups[groupIndex].messages.findIndex(m => m.message === reaction.message.id)
    const reactedRole = roleGroups[groupIndex].messages[messageIndex].reacts.find(r => r.emoji === reaction.emoji.identifier)
    const guildRole = gm.guild.roles.resolve(reactedRole.role)
    
    if (!guildRole) { 
        cli.logger.log('ERROR', 'Unable to find role tied to this emoji.')
        return false
    }
    else if (gm.roles.cache.has(guildRole.id)) return true

    const { nodm: nodmNotify } = roleGroups[groupIndex].messages[messageIndex]
    const { singleLock, rolesRequired: requiredRoles, ignoreRoles } = roleGroups[groupIndex]

    if (!requiredRoles.arrayEmpty() && !gm.roles.cache.every(r => requiredRoles.some(rq => rq === r.id))) return false
    if (!ignoreRoles.arrayEmpty() && !gm.roles.cache.some(r => ignoreRoles.some(ir => ir === r.id))) return false

    if (singleLock) {
        if (gm.roles.cache.some(role => roleGroups[groupIndex].roles.some(r => r === role.id) && role.id !== reactedRole.role)) {
            const oldRole = gm.roles.cache.find(role => roleGroups[groupIndex].roles.find(r => r === role.id) && role.id !== reactedRole.role)
            const oldEmoji = roleGroups[groupIndex].messages[messageIndex].reacts.find(r => r.role === oldRole.id).emoji
            const oldReact = reaction.message.reactions.cache.find(react => react.emoji.identifier === oldEmoji)
            
            await gm.roles.remove(oldRole)
            await oldReact.users.remove(user)
        }
    }

    await gm.roles.add(guildRole)

    if (!nodmNotify) await user.createDM().then(dm => dm.send(`**${gm.guild.name}**: You have been given \`${guildRole.name}\``))
}

export async function reactRemoveEvent(reaction: MessageReaction, user: User) {
    const cli = reaction.client as Abby
    const gm = reaction.message.guild.members.resolve(user.id)

    const roleGroups: RoleGroup[] = cli.settings.get(reaction.message.guild, 'reaction.role-groups', [])
    if (roleGroups.arrayEmpty()) return false
    if (!roleGroups.find(rg => rg.messages.some(m => m.message === reaction.message.id))) return false

    const groupIndex = roleGroups.findIndex(rg => rg.messages.some(m => m.message === reaction.message.id))
    const messageIndex = roleGroups[groupIndex].messages.findIndex(m => m.message === reaction.message.id)
    const unreactedRole = roleGroups[groupIndex].messages[messageIndex].reacts.find(r => r.emoji === reaction.emoji.identifier)
    const guildRole = gm.guild.roles.resolve(unreactedRole.role)

    if (!guildRole) return false
    else if (!gm.roles.cache.has(guildRole.id)) return true

    const { nodm: nodmNotify, rr: resetRole } = roleGroups[groupIndex].messages[messageIndex]
    const { rolesRequired: requiredRoles, ignoreRoles } = roleGroups[groupIndex]

    if (!requiredRoles.arrayEmpty() && !gm.roles.cache.every(r => requiredRoles.some(rq => rq === r.id))) return false
    if (!ignoreRoles.arrayEmpty() && !gm.roles.cache.some(r => ignoreRoles.some(ir => ir === r.id))) return false
    if (!resetRole) return false

    await gm.roles.remove(guildRole)

    if (!nodmNotify) await user.createDM().then(dm => dm.send(`**${gm.guild.name}**: You have removed \`${guildRole.name}\``))
}

export async function createRoleMenu(message: Message, group: RoleGroup, msg: Message = null) {
    const reactData: RoleMessageReacts[] = []
    let setupMsg = !msg ? await message.channel.send('Role Menu\nSetting up...') : null
    const reactMsg = await message.channel.send(`Rolemenu setup: [0/${group.roles.length}]`)
    let lastContent = ''

    for (let [i, r] of group.roles.entries()) {
        const role = message.guild.roles.resolve(r)
        if (!role) return null

        reactMsg.edit(
            `Rolemenu setup: [${i + 1}/${group.roles.length}]\n` +
            `React with the emoji for the role command: \`${role.name}\`\n` +
            'Note: The bot must be in the server the emoji is from, else it will fail.\n\n' +
            'Throughout the setup, the message will be updated.'
        )

        const emote = await getEmote(message, reactMsg, msg || setupMsg)
        reactData.push({ emoji: emote.identifier, role: r })

        if (i === 0 && !msg) setupMsg.edit(`**Role Menu: ${group.groupName}**\n\n` + `${emote}: \`${role.name}\``).then(m => lastContent = m.content)
        else if (!msg) setupMsg.edit(`${lastContent}\n` + `${emote}: \`${role.name}\``)
    }

    reactMsg.edit(
        'Setup complete! You can delete all the messages now (except for the menu itself)\n\n' +
        'Flags:\n' +
        `\`-nodm: false\` toggle with \`rolemenu update \`${group.groupName}\` -nodm ${setupMsg.id}\`: disables dm messages.\n` +
        `\`-rr: true\` toggle with \`rolemenu update \`${group.groupName}\` -rr ${setupMsg.id}\`: removing reactions removes the role.`
    )

    group.messages.push({ message: setupMsg?.id || msg.id, channel: setupMsg.channel.id, nodm: false, rr: true, reacts: reactData })
    return group
}

export async function updateRoleMenu(message: Message, group: RoleGroup, tag: ReactTags, messageID: string) {
    const msgIndex = group.messages.findIndex(msgArr => msgArr.message === messageID)
    
    if (tag === '-nodm') group.messages[msgIndex].nodm = !group.messages[msgIndex].nodm
    else group.messages[msgIndex].rr = !group.messages[msgIndex].rr

    const { message: m, nodm, rr } = group.messages[msgIndex]

    message.channel.send(
        'Rolemenu has successfully been updated!\n\n' +
        'Flags:\n' +
        `\`-nodm: ${nodm}\` toggle with \`rolemenu update \`${group.groupName}\` -nodm ${messageID}\`: disables dm messages.\n` +
        `\`-rr: ${rr}\` toggle with \`rolemenu update \`${group.groupName}\` -rr ${messageID}\`: removing reactions removes the role.`
    )

    return group
}

export async function editRoleMenu(message: Message, group: RoleGroup, msg: Message) {
    const msgIndex = group.messages.findIndex(mArr => mArr.message === msg.id)
    
    if (msg.author === message.client.user) {
        await msg.fetch()
        const reactMsg = await message.channel.send(`Editing existing rolemenu... [0/${group.roles.length}]`)
        let lastContent = ''

        for (let [i, r] of group.messages[msgIndex].reacts.entries()) {
            if (r.role !== group.roles[i]) group.messages[msgIndex].reacts[i].role = group.roles[i]
            const role = message.guild.roles.resolve(r.role)
            if (!role) return null

            reactMsg.edit(
                `Rolemenu setup: [${i + 1}/${group.messages[msgIndex].reacts.length}]` +
                `React with the emoji for the role command: \`${role.name}\`` +
                'Note: The bot must be in the server the emoji is from, else it will fail\n\n' +
                'Throughout the setup, the original message will be updated.'
            )

            const emote = await getEmote(message, reactMsg, msg)
            await msg.reactions.cache.find(react => react.emoji.identifier === r.emoji).remove()
            group.messages[msgIndex].reacts[i].emoji = emote.identifier
            msg.react(emote)

            if (i === 0) message.edit(`**Role Menu: ${group.groupName}**\n\n` + `${emote}: \`${role.name}\``).then(m => lastContent = m.content)
            else if (!msg) message.edit(`${lastContent}\n` + `${emote}: \`${role.name}\``)
        }

        reactMsg.edit(
            'Successfully edited existing rolemenu! You can now delete all messages (except for the menu itself)\n\n' +
            'Flags:\n' +
            `\`-nodm: ${group.messages[msgIndex].nodm}\` toggle with \`rolemenu update \`${group.groupName}\` -nodm ${message.id}\`: disables dm messages.\n` +
            `\`-rr: ${group.messages[msgIndex].rr}\` toggle with \`rolemenu update \`${group.groupName}\` -rr ${message.id}\`: removing reactions removes the role.`
        )
    } else {
        await msg.fetch()
        const reactMsg = await message.channel.send(`Editing existing rolemenu... [0/${group.roles.length}]`)

        for (let [i, r] of group.messages[msgIndex].reacts.entries()) {
            const role = message.guild.roles.resolve(r.role)
            if (!role) return null

            reactMsg.edit(
                `Rolemenu setup: [${i + 1}/${group.messages[msgIndex].reacts.length}]` +
                `React with the emoji for the role command: \`${role.name}\`` +
                'Note: The bot must be in the server the emoji is from, else it will fail\n\n' +
                'Throughout the setup, the original message will be updated.'
            )

            const emote = await getEmote(message, reactMsg, msg)
            await msg.reactions.cache.find(react => react.emoji.identifier === r.emoji).remove()
            group.messages[msgIndex].reacts[i].emoji = emote.identifier
            msg.react(emote)
        }
    }
}

export async function removeRoleMenu(message: Message, group: RoleGroup, msg: Message) {
    const loading = await message.channel.send('Removing rolemenu instance...')
    group.messages = group.messages.filter(m => m.message === msg.id)

    await msg.reactions.removeAll()
    msg.author === msg.client.user ? msg.delete() : void 0
    loading.edit('Successfully removed this rolemenu.')
    setTimeout(() => loading.delete(), 1e4)
    return group
}

export async function resetRoleMenu(message: Message, messageGroup: RoleMessage, msg: Message) {
    const cli = message.client as Abby
    const resetMsg = await message.channel.send('Resetting the reacts for the provided mesasge.')
    await msg.reactions.removeAll()
    
    try {
        for (const [i, r] of messageGroup.reacts.entries()) {
            const role = message.guild.roles.resolve(r.role)

            try {
                const emote = r.emoji.includes('%') ? r.emoji : message.guild.emojis.resolve(r.emoji.substring(r.emoji.lastIndexOf(':') + 1, r.emoji.lastIndexOf('>'))) //ID
                await msg.react(emote)
            } catch {
                await resetMsg.edit(`Please provide a new react for the role \`${role.name}\` (react to this message)`)
                const replaceEmote = await getEmote(message, resetMsg)
                await msg.react(replaceEmote)
                messageGroup.reacts[i].emoji = replaceEmote.identifier
            }
        }
        resetMsg.edit('Successfully reset the reactions for the rolemenu message.')
        setTimeout(() => resetMsg.delete(), 5000)
        return messageGroup
    } catch {
        message.channel.send('Unable to re-add the reactions.\nThis is possibly because some emotes are no longer available.')
        return null
    }
}
//TODO: Fix emote detection and editing original message if sent by bot

export const getEmote = async (m: Message, reactMsg: Message, origMsg: Message = null): Promise<GuildEmoji | ReactionEmoji> => {
    const filter = (r: MessageReaction, u: User) => u.id === m.author.id
    const reaction = (await reactMsg.awaitReactions({ filter: filter, maxEmojis: 1, max: 1, time: 3e5 })).first()

    const emote = reaction.emoji
    if (emote instanceof GuildEmoji && !emote.available) {
        m.channel.send('This emoji is not available, please use another emoji that is available.')
        return getEmote(m, reactMsg, origMsg)
    }
    else if (emote instanceof ReactionEmoji) {
        try { 
            if (origMsg) await origMsg.react(emote)
            return emote
        }
        catch {
            m.channel.send('I am unable to access this emote, please use another emoji that is available.')
            return getEmote(m, reactMsg, origMsg)
        }
    }
    else {
        if (origMsg) await origMsg.react(emote)
        return emote
    }
}