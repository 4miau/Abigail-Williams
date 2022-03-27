declare type AutomodTags = 'ANTIEVERYONE' | 'MAXMENTIONS' | 'MAXLINES' | 'ANTIINVITE' | 'ANTISPAM'
declare type AutoroleTags = 'humans' | 'bots' | 'all'

declare type RoleGroup = { groupName: string, roles: string[], singleLock: boolean, rolesRequired: string[], ignoreRoles: string[], messages: RoleMessage[] }
declare type RoleMessage = { message: string, channel: string, nodm: boolean, rr: boolean, reacts: RoleMessageReacts[] }
declare type RoleMessageReacts = { emoji: string, role: string }
declare type ReactOptions = 'SINGLELOCK'

declare type MenuTags = 'update' | 'create' | 'remove' | 'reset' | 'edit' | 'finish'
declare type ReactTags = '-nodm' | '-rr' | '-m'

declare type Streamer = { id: string, name: string, message: string, pings: string[], posted: boolean }