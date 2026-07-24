import { QcCommandContext } from "../QcCommands.js";
import { QcToken } from "../QcTokenizer.js";
import { QcCmdParserContext } from "./QcCmdParsers.js";

export interface QcCommandContext_Sequence extends QcCommandContext {
    name: string;
    /**
     *  List of animations this is referencing.
     *  Because QC is stupid, these could either be references to $animation or files on disk like .smd files
     *  Can't know which it's referencing from the syntax, you need to parse $animation first and look up the list of animations
     * */
    references: string[];

    snap?: boolean;
    loop?: boolean;
    hidden?: boolean;
    noAnimation?: boolean;
    autoplay?: boolean;
    worldSpace?: boolean;
    worldSpaceBlend?: boolean;
    worldRelative?: boolean;
    realTime?: boolean;

    frames?: { start: number; end: number };
}

export function parseSequence(tokens: QcToken[]): QcCommandContext_Sequence | undefined {
    if (tokens.length === 0) return undefined;
    const c = new QcCmdParserContext(tokens);
    c.nextToken();

    // The first token needs to be a literal, which is the name of the sequence
    const name = c.getTokenString();
    if (!name) return undefined;

    const result: QcCommandContext_Sequence = {
        name: name,
        references: [],
    };

    while (c.nextToken()) {
        const str = c.getTokenString();

        if (str === "snap") {
            result.snap = true;
        } else if (str === "loop") {
            result.loop = true;
        } else if (str === "hidden") {
            result.hidden = true;
        } else if (str === "noanimation") {
            result.noAnimation = true;
        } else if (str === "autoplay") {
            result.autoplay = true;
        } else if (str === "worldspace") {
            result.worldSpace = true;
        } else if (str === "worldspaceblend") {
            result.worldSpaceBlend = true;
        } else if (str === "worldrelative") {
            result.worldRelative = true;
        } else if (str === "realtime") {
            result.realTime = true;
        } else if (str === "frames" || str === "frame") {
            c.nextToken();
            const start = c.getTokenInt();
            c.nextToken();
            const end = c.getTokenInt();
            if (start !== undefined && end !== undefined) {
                result.frames = { start, end };
            }
        } else if (str) {
            result.references.push(str);
        }
    }

    return result;
}
