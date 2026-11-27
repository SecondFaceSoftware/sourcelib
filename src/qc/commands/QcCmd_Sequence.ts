import { QcCommandContext } from "../QcCommands.js";
import { QcToken } from "../QcTokenizer.js";
import { QcCmdParserContext } from "./QcCmdParsers.js";

export interface QcCommandContext_Sequence_Activity {
    name: string;
    weight: number;
}

export interface QcCommandContext_Sequence_Event {
    name: string;
    frame: number;
    options?: string;
}

export interface QcCommandContext_Sequence_AutoLayer {
    name: string;
    flags: QcCommandContext_Sequence_AutoLayerFlag[];
}

export const QcCommandContext_Sequence_AutoLayerFlags = {
    Post: 0x0010,
    Spline: 0x0040,
    XFade: 0x0080,
    NoBlend: 0x0200,
    Local: 0x1000,
    Pose: 0x4000,
} as const;
export type QcCommandContext_Sequence_AutoLayerFlag =
    (typeof QcCommandContext_Sequence_AutoLayerFlags)[keyof typeof QcCommandContext_Sequence_AutoLayerFlags];

export interface QcCommandContext_Sequence extends QcCommandContext {
    name: string;
    /**
     *  List of animations this is referencing.
     *  Because QC is stupid, these could either be references to $animation or files on disk like .smd files
     *  Can't know which it's referencing from the syntax, you need to parse $animation first and look up the list of animations
     * */
    references: string[];

    activities: QcCommandContext_Sequence_Activity[];
    events: QcCommandContext_Sequence_Event[];
    autoLayers: QcCommandContext_Sequence_AutoLayer[];

    snap?: boolean;
    loop?: boolean;
    hidden?: boolean;
    noAnimation?: boolean;
    autoplay?: boolean;
    worldSpace?: boolean;
    worldSpaceBlend?: boolean;
    worldRelative?: boolean;
    realTime?: boolean;
    fps?: number;

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
        activities: [],
        events: [],
        autoLayers: [],
    };

    let depth = 0;

    while (c.nextToken()) {
        const str = c.getTokenString();

        if (str === "{") {
            depth++;
        } else if (str === "}") {
            depth--;
        } else if (str === "snap") {
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
        } else if (str === "activity" || str?.startsWith("ACT_")) {
            if (!str.startsWith("ACT_")) {
                c.nextToken();
            }
            const activityName = c.getTokenString();
            c.nextToken();
            const activityWeight = c.getTokenInt();
            if (activityName !== undefined && activityWeight !== undefined) {
                result.activities.push({ name: activityName, weight: activityWeight });
            }
        } else if (str === "event") {
            c.nextToken();
            const eventName = c.getTokenString();
            c.nextToken();
            const frame = c.getTokenInt();
            c.nextToken();
            const optionsOrClosingBrace = c.getTokenString();
            if (eventName !== undefined && frame !== undefined) {
                if (optionsOrClosingBrace === "}") {
                    result.events.push({ name: eventName, frame });
                } else if (optionsOrClosingBrace !== undefined) {
                    result.events.push({ name: eventName, frame, options: optionsOrClosingBrace });
                }
            }
        } else if (str === "addlayer") {
            c.nextToken();
            const layerName = c.getTokenString();
            if (layerName) {
                c.nextToken();
                const localOption = c.getTokenString();
                if (localOption === "local") {
                    c.unGetToken();
                    result.autoLayers.push({
                        name: layerName,
                        flags: [QcCommandContext_Sequence_AutoLayerFlags.Local],
                    });
                } else {
                    result.autoLayers.push({
                        name: layerName,
                        flags: [],
                    });
                }
            }
        } else if (str === "fps") {
            c.nextToken();
            result.fps = c.getTokenFloat();
        } else if (str) {
            result.references.push(str);
        }
    }

    return result;
}
