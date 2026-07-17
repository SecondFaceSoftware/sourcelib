import { QcCommandContext } from "../QcCommands.js";
import { QcToken, QcTokenTypes } from "../QcTokenizer.js";
import { QcCmdParserContext } from "./QcCmdParsers.js";

export interface QcCommandContext_CollisionModel extends QcCommandContext {
    file: string;
}

export function parseCollisionModel(tokens: QcToken[]): QcCommandContext_CollisionModel | undefined {
    if (tokens.length === 0) return undefined;
    const c = new QcCmdParserContext(tokens);

    let file = "";

    if (c.nextToken()?.type === QcTokenTypes.Literal) {
        file = c.getTokenString()!;
    }

    // TODO: Parse the rest of $collisionmodel and $collisionjoints

    return { file };
}
