import { QcCommandContext } from "../QcCommands";
import { QcToken, QcTokenTypes } from "../QcTokenizer";
import { QcCmdParserContext } from "./QcCmdParsers";

export interface QcCommandContext_ModelName extends QcCommandContext {
    file: string;
}

export function parseModelName(tokens: QcToken[]): QcCommandContext_ModelName | undefined {
    if (tokens.length === 0) return undefined;
    const c = new QcCmdParserContext(tokens);

    let file = "";

    if (c.nextToken()?.type === QcTokenTypes.Literal) {
        file = c.getTokenString()!;
    }

    return { file };
}
