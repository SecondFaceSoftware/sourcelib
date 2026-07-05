import {
    QcCommand,
    QcCommandContent,
    QcCommandContext,
    QcCommandToParseFunctionMap,
    QcDocument,
} from "./QcCommands.js";
import { QcToken, QcTokenizer, QcTokenTypes } from "./QcTokenizer.js";

export const QcParser = {
    parseText(text: string): QcDocument {
        return QcParser.parseTokens(QcTokenizer.tokenizeText(text));
    },
    parseTokens(qcTokens: QcToken[]): QcDocument {
        const knownCmds = Object.values(QcCommand) as string[];

        let scope = 0;

        const resultCommands: QcCommandContent[] = [];

        let command: QcCommand | undefined = undefined;
        let commandToken: QcToken | undefined = undefined;
        let contentTokens: QcToken[] = [];

        for (const qcToken of qcTokens) {
            if (qcToken.type === QcTokenTypes.ScopeStart) {
                scope++;
            } else if (qcToken.type === QcTokenTypes.ScopeEnd) {
                scope--;
            } else if (qcToken.type === QcTokenTypes.Command && scope === 0) {
                if (command && commandToken) {
                    resultCommands.push({
                        command,
                        commandToken,
                        contentTokens,
                        content: _parseCommandContent(command, contentTokens),
                    });
                    command = undefined;
                    commandToken = undefined;
                    contentTokens = [];
                }

                if (knownCmds.includes(qcToken.value)) {
                    command = qcToken.value as QcCommand;
                    commandToken = qcToken;
                    continue;
                } else {
                    // todo: return an error that there's an unknown qc command
                    continue;
                }
            }

            const shouldPushToCommand =
                scope > 0 ? qcToken.type !== QcTokenTypes.Comment : qcToken.type >= QcTokenTypes.Literal;

            if (command && shouldPushToCommand) {
                contentTokens.push(qcToken);
            }
        }

        if (command && commandToken) {
            resultCommands.push({
                command,
                commandToken,
                contentTokens,
                content: _parseCommandContent(command, contentTokens),
            });
        }

        return { commands: resultCommands };
    },
};

function _parseCommandContent(cmd: QcCommand, tokens: QcToken[]): QcCommandContext | undefined {
    return QcCommandToParseFunctionMap[cmd](tokens);
}
