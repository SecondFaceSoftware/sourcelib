import { KvStringUtil } from "../kv/KvStringUtil.js";

export const SharedTokenizer = {
    consumeComment(text: string, i: number): number {
        let n = 1;
        let c = text[i];
        for (; c != null; c = text[i + n++]) {
            if (c === "\n" || c === "\r") {
                break;
            }
        }

        return n + 1;
    },
    consumeString(text: string, i: number): number {
        const c = text[i];

        // Is it quoted?
        if (c === '"' || c === "'") {
            return SharedTokenizer.consumeStringQuoted(text, i + 1, c);
        } else {
            return SharedTokenizer.consumeStringUnquoted(text, i + 1);
        }
    },
    consumeStringQuoted(text: string, i: number, startingQuote: string): number {
        let n = 1;
        let escaped = false;
        let c = text[i];
        for (; c != null; c = text[i + n++]) {
            if (c === "\n") {
                return n;
            }
            if (c === "\\") {
                escaped = !escaped;
                continue;
            }

            if (c === startingQuote) {
                if (escaped) {
                    escaped = false;
                    continue;
                } else {
                    break;
                }
            } else {
                if (escaped) escaped = false;
            }
        }

        return n + 1;
    },
    consumeStringUnquoted(text: string, i: number): number {
        let n = 0;
        for (; i + n < text.length && !KvStringUtil.isWhitespace(text[i + n]); n++);
        return n + 1;
    },
};
