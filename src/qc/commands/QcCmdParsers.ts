import { QcToken, QcTokenTypes } from "../QcTokenizer.js";
import { KvStringUtil } from "../../kv/KvStringUtil.js";

export class QcCmdParserContext {
    pos = -1;
    tokens: QcToken[] = [];

    constructor(tokens: QcToken[]) {
        this.tokens = tokens;
    }

    nextToken(): QcToken | undefined {
        if (this.pos + 1 < this.tokens.length) {
            this.pos++;
            return this.getToken();
        } else {
            return undefined;
        }
    }
    getToken(): QcToken | undefined {
        return this.pos < this.tokens.length ? this.tokens[this.pos] : undefined;
    }
    getTokenString(): string | undefined {
        const t = this.getToken();
        if (t && (t.type === QcTokenTypes.Literal || t.type === QcTokenTypes.Command)) {
            return KvStringUtil.stripQuotes(t.value);
        } else {
            return undefined;
        }
    }
    getTokenFloat(): number | undefined {
        const t = this.getTokenString();
        if (!t) return undefined;

        if (KvStringUtil.isFloatValue(t)) {
            return Number.parseFloat(t);
        }

        return undefined;
    }
    getTokenInt(): number | undefined {
        const t = this.getTokenString();
        if (!t) return undefined;

        if (KvStringUtil.isIntegerValue(t)) {
            return Number.parseInt(t);
        }

        return undefined;
    }
}
