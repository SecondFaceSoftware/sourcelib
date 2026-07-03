import { QcCommand, QcCommandContent, QcDocument } from "./QcCommands";
import { QcToken, QcTokenizer, QcTokenTypes } from "./QcTokenizer";

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
        let content: QcToken[] = [];

        for (const qcToken of qcTokens) {
            if (qcToken.type === QcTokenTypes.ScopeStart) {
                scope++;
            } else if (qcToken.type === QcTokenTypes.ScopeEnd) {
                scope--;
            } else if (qcToken.type === QcTokenTypes.Command && scope === 0) {
                if (command && commandToken) {
                    resultCommands.push({ command, commandToken, content });
                    command = undefined;
                    commandToken = undefined;
                    content = [];
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
                content.push(qcToken);
            }
        }

        if (command && commandToken) {
            resultCommands.push({ command, commandToken, content });
        }

        return { commands: resultCommands };
    },
};
