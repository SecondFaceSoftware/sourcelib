import { QcCommandContext } from "../QcCommands";
import { QcToken, QcTokenTypes } from "../QcTokenizer";
import { QcCmdParserContext } from "./QcCmdParsers";

export interface QcCommandContext_Body extends QcCommandContext {
    skinName: string;
    studio: QcCommandContext_Partial_Studio;
}

export function parseBody(tokens: QcToken[]): QcCommandContext_Body | undefined {
    if (tokens.length === 0) return undefined;
    const c = new QcCmdParserContext(tokens);

    let skinName = "";

    if (c.nextToken()?.type === QcTokenTypes.Literal) {
        skinName = c.getTokenString()!;
    }

    // Skip to the next token that's relevant to studio options
    c.nextToken();
    const studio = parseStudio(c);

    return { skinName, studio };
}

export interface QcCommandContext_Partial_Studio {
    fileName?: string;

    /** Flip triangles */
    reverse?: boolean;
    scale?: number;
    subd?: boolean;
}

// TODO: This is missing the explicit ignoring of faces and bias and open scopes
/**
 * Parse the common studio model options
 * @param c The cmd parser context to use. Its state must point to the first token that's relevant for studio options!
 */
export function parseStudio(c: QcCmdParserContext): QcCommandContext_Partial_Studio {
    const result: QcCommandContext_Partial_Studio = {};

    if (c.getToken()) {
        result.fileName = c.getTokenString();
    }

    while (c.nextToken()) {
        const str = c.getTokenString();
        if (str === "reverse") {
            result.reverse = true;
            continue;
        }

        if (str === "scale") {
            c.nextToken();
            result.scale = c.getTokenFloat();
        }

        if (str === "subd") {
            result.subd = true;
        }
    }

    return result;
}
