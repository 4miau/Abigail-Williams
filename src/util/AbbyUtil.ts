import { AkairoClient, ClientUtil } from "discord-akairo";
import { GuildMember, Guild } from "discord.js";
import * as util from "./Functions";

export default class AbbyUtil extends ClientUtil {
    public constructor(client: AkairoClient) {
        super(client)
    }

    //MISC FUNCTIONS
    getRandomInt(length: number): number { return util.getRandomInt(length) }

    //ARRAY-BASED FUNCTIONS

    getRandomIntRange(min: number, max: number): number { return util.getRandomIntRange(min, max) }

    shuffleArray(arr: string[]): string[] { return util.shuffleArray(arr) }

    chunk(arr: string[], size: number): string[] { return util.chunk(arr, size) }

    chunkNewLine(arr: string[], size: number): string[] { return util.chunkNewLine(arr, size) }

    //GUILD FUNCTIONS

    getJoinPosition(member: GuildMember, guild: Guild): number { return util.getJoinPosition(member, guild) }
}