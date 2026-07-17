import { Range, Token, TokenList, TokenType } from "./KvParser.js";
import { SharedTokenizer } from "../_shared/SharedTokenizer.js";

const preprocessorRegex = /#(base|include)/;

export const KvTokenizer = {
    /**
     * Sets basic tokens for the file provided. The semantic token provider must do analysis on these, as it's not done here. These tokens could be in illegal positions, but since we might want to do different analysis depending on the keyvalue format (eg VMT), it's better to analyse later.
     * @param text The text of the file to tokenize
     */
    tokenize(text: string): TokenList {
        return _tokenizeInternal(text);
    },
};

function _tokenizeInternal(text: string): TokenList {
    const textSize = text.length;
    const tokenList = new TokenList();

    let line = 0;
    let lineColumn = -1;
    let expectingKey = true;
    for (let i = 0; i < textSize; i++) {
        const c = text[i];
        lineColumn++;

        // Skip forward to the next interesting token
        if (c === " " || c === "\t") continue;
        if (c === "\r" || c === "\n") {
            if (c === "\n") {
                line++;
                lineColumn = -1;
            }
            expectingKey = true;
            continue;
        }

        // Is it a comment?
        if (c === "/" && text[i + 1] === "/") {
            const commentLength = SharedTokenizer.consumeComment(text, i + 2);
            tokenList.push(
                new Token(
                    TokenType.Comment,
                    new Range(lineColumn, lineColumn + commentLength),
                    text.substring(i, i + commentLength),
                    line,
                ),
            );
            i += commentLength - 1;
            lineColumn += commentLength - 1;
            continue;
        }

        // Is it an object?
        if (c === "{") {
            tokenList.push(new Token(TokenType.ObjectStart, new Range(lineColumn, lineColumn + 1), text[i], line));
            expectingKey = true;
            continue;
        }
        if (c === "}") {
            tokenList.push(new Token(TokenType.ObjectEnd, new Range(lineColumn, lineColumn + 1), text[i], line));
            continue;
        }

        // Is it a conditional?
        if (c === "[") {
            const conditionalLength = consumeConditional(text, i);
            tokenList.push(
                new Token(
                    TokenType.Conditional,
                    new Range(lineColumn, lineColumn + conditionalLength),
                    text.substring(i, i + conditionalLength),
                    line,
                ),
            );
            i += conditionalLength - 1;
            continue;
        }

        // No, it's a string!
        const stringLength = SharedTokenizer.consumeString(text, i);
        const stringContent = text.substring(i, i + stringLength);
        let tokenType = expectingKey ? TokenType.Key : TokenType.Value;

        // Are we a preprocessor key?

        if (expectingKey && stringContent.match(preprocessorRegex)) {
            tokenType = TokenType.PreprocessorKey;
        }

        tokenList.push(new Token(tokenType, new Range(lineColumn, lineColumn + stringLength), stringContent, line));
        if (expectingKey) expectingKey = false;
        i += stringLength - 1; // Prevents skipping the next character after the string
        lineColumn += stringLength - 1;
        continue;
    }

    return tokenList;
}

export function consumeConditional(text: string, i: number): number {
    let n = 1;
    let c = text[i];
    for (; c != null; c = text[i + n++]) {
        if (c === "]" || c === "\n" || c === "\r") {
            break;
        }
    }
    return n;
}
