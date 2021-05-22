import { GuildMember, Message, MessageEmbed, User } from "discord.js"
import ms from "ms"

const ACTIONS = ({
	1: 'ban',
	2: 'unban',
	3: 'kick',
	4: 'kick',
	5: 'mute',
    6: 'unmute',
	7: 'restriction',
	8: 'warn',
	9: 'pardon'
}) as { [key: number]: string }

export default {
	CONSTANTS: {
		ACTIONS: {
			BAN: 1,
			UNBAN: 2,
			SOFTBAN: 3,
			KICK: 4,
			MUTE: 5,
            UNMUTE: 6,
			REACTION: 7,
			WARN: 8,
			PARDON: 9
		} as { [key: string]: number },
		COLORS: {
			BAN: 16718080,
			UNBAN: 8450847,
			SOFTBAN: 16745216,
			KICK: 16745216,
			MUTE: 16763904,
            UNMUTE: 8450847,
			REACTION: 16776960,
			WARN: 16776960,
			PARDON: 16776960
		} as { [key: string]: number }
	},
    modLogEmbed: ({message = null, member, action, duration = null, caseNum, reason, ref = null}: {message: Message, member: User | GuildMember, action: string, duration?: number, caseNum: number, reason: string, ref?: number }) => {
		const embed = new MessageEmbed()

		if (message) {
			embed.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
		}

		embed
			.setDescription(`
				**Member:** ${member instanceof User ? member.tag : member.user.tag} (${member.id})
				**Action:** ${action}${action === 'Mute' && duration ? `\n**Length:** ${ms(duration, { long: true })}` : ''}
				**Reason:** ${reason}${ref ? `\n**Ref case:** ${ref}` : ''}
			`)
			.setFooter(`Case ${caseNum}`)
			.setTimestamp(new Date());

		return embed;
    },
    historyEmbed: ({member, cases}: {member: GuildMember, cases: any}) => {
		const footer = cases.reduce((count: any, c: any) => {
			const action = ACTIONS[c.action]
			count[action] = (count[action] || 0) as number + 1
		}, {})

		const colours = [8450847, 10870283, 13091073, 14917123, 16152591, 16667430, 16462404]
		const vals = [footer.warn || 0, footer.restriction || 0, footer.mute || 0, footer.kick || 0, footer.ban || 0]
		const [warn, restriction, mute, kick, ban] = vals
		const colorIndex = Math.min(vals.reduce((a: number, b: number) => a + b), colours.length - 1)

		return new MessageEmbed()
			.setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL())
			.setColor(colours[colorIndex])
			.setFooter(`
			${warn} warning${warn > 1 || warn === 0 ? 's' : ''},
			${mute} mute${mute > 1 || mute === 0 ? 's' : ''},
			${kick} kick${kick > 1 || kick === 0 ? 's' : ''},
			and ${ban} ban${ban > 1 || ban === 0 ? 's' : ''}.
		`)

    }
}

			//EMBED: 7,
			//EMOJI: 8,
			
			//EMBED: 16776960,
			//EMOJI: 16776960,