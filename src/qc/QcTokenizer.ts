import { SharedTokenizer } from "../_shared/SharedTokenizer";

export const QcTokenizer = {
    tokenizeText(text: string): QcToken[] {
        const tokenList: QcToken[] = [];

        let line = 0;
        let lineColumn = -1;
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            const a = text.charCodeAt(i);
            const n = text.length - 1 > i ? text.charAt(i + 1) : undefined;
            lineColumn++;

            // CR and LF are < 32 in ascii so handle these before the next if
            if (c === "\r" || c === "\n") {
                if (c === "\n") {
                    line++;
                    lineColumn = -1;
                }
                continue;
            }

            // Ascii codes below 32 are control chars (including tab).
            // 32 is space. Skip forward on these
            if (a <= 32) continue;

            if (c === "/" && n === "/") {
                const commentLength = SharedTokenizer.consumeComment(text, i + 2);
                tokenList.push({
                    line,
                    type: QcTokenTypes.Comment,
                    range: { start: lineColumn, end: lineColumn + commentLength },
                    value: text.substring(i, i + commentLength),
                });
                i += commentLength - 1;
                lineColumn += commentLength - 1;
                continue;
            }

            if (c === "#" || c === ";") {
                const commentLength = SharedTokenizer.consumeComment(text, i + 1);
                tokenList.push({
                    line,
                    type: QcTokenTypes.Comment,
                    range: { start: lineColumn, end: lineColumn + commentLength - 1 },
                    value: text.substring(i, i + commentLength - 1),
                });
                i += commentLength - 2;
                lineColumn += commentLength - 2;
                continue;
            }

            // Is it a scope?
            if (c === "{") {
                tokenList.push({
                    line,
                    type: QcTokenTypes.ScopeStart,
                    range: { start: lineColumn, end: lineColumn + 1 },
                    value: c,
                });
                continue;
            }
            if (c === "}") {
                tokenList.push({
                    line,
                    type: QcTokenTypes.ScopeEnd,
                    range: { start: lineColumn, end: lineColumn + 1 },
                    value: c,
                });
                continue;
            }

            // if it's not a scope, count it as a string literal or command
            const stringLength = SharedTokenizer.consumeString(text, i);
            const stringContent = text.substring(i, i + stringLength);

            const isCommand = stringContent.startsWith("$");

            tokenList.push({
                line,
                type: isCommand ? QcTokenTypes.Command : QcTokenTypes.Literal,
                range: { start: lineColumn, end: lineColumn + stringLength },
                value: stringContent,
            });

            i += stringLength - 1; // Prevents skipping the next character after the string
            lineColumn += stringLength - 1;
        }

        return tokenList;
    },
};

export const QcTokenTypes = {
    Comment: 0,
    Command: 1,
    Literal: 2,
    ScopeStart: 3,
    ScopeEnd: 4,
} as const;
export type QcTokenType = (typeof QcTokenTypes)[keyof typeof QcTokenTypes];

interface QcRange {
    start: number;
    end: number;
}

export interface QcToken {
    line: number;
    range: QcRange;
    type: QcTokenType;
    value: string;
}
