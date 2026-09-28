import { KvTokenizer } from "./KvTokenizer.js";
import { KvStringUtil } from "./KvStringUtil.js";
import { ParserPosition, ParserRange } from "../_shared/SharedParser.js";

export enum KvTokenType {
    Comment,
    Key,
    Value,
    ObjectStart,
    ObjectEnd,
    PreprocessorKey,
    Conditional,
}

export class KvToken {
    type: KvTokenType;
    range: ParserRange;
    value: string;
    line: number;

    constructor(type: KvTokenType, range: ParserRange, value: string, line: number) {
        this.type = type;
        this.range = range;
        this.value = value;
        this.line = line;
    }

    public toLiteral(): KvLiteral {
        return new KvLiteral(this.getPosition(), this.value);
    }

    public getPosition(): ParserPosition {
        return new ParserPosition(this.line, this.range);
    }

    public toConditional(): KvConditional {
        return new KvConditional(this.getPosition(), this.value);
    }
}

export class KvTokenList extends Array<KvToken> {
    public static create(tokens: KvToken[]): KvTokenList {
        return new KvTokenList(...tokens);
    }

    public getAllOnLine(line: number): KvTokenList {
        return KvTokenList.create(this.filter((t) => t.line == line));
    }

    public getAllOfType(type: KvTokenType): KvTokenList {
        return KvTokenList.create(this.filter((t) => t.type == type));
    }
}

export class KvParseError {
    public type: KvParseErrorType;
    public position: ParserPosition;

    constructor(type: KvParseErrorType, position: ParserPosition) {
        this.type = type;
        this.position = position;
    }
}

export enum KvParseErrorType {
    MissingValue,
    MissingKey,
    MissingClosingBrace,
    UnexpectedOpeningBrace,
    UnexpectedClosingBrace,
    MissingRootObject,
}

export class KvLiteral {
    private position: ParserPosition;
    private content: string;

    constructor(position: ParserPosition, content: string) {
        this.position = position;
        this.content = content;
    }

    public isQuoted(): boolean {
        return KvStringUtil.isQuoted(this.content);
    }

    public getPosition(): ParserPosition {
        return this.position;
    }

    public getUnquotedContent(): string {
        if (!this.isQuoted()) return this.content;

        return KvStringUtil.stripQuotes(this.content);
    }

    public getContent(): string {
        return this.content;
    }

    public asUnquoted(): KvLiteral {
        if (!this.isQuoted()) return this;

        const newContent = KvStringUtil.stripQuotes(this.getContent());
        const newRange = this.getPosition().getRange().copy();
        newRange.moveStartBy(1);
        newRange.moveEndBy(-1);
        const newPosition = new ParserPosition(this.getPosition()!.getLine(), newRange);
        return new KvLiteral(newPosition, newContent);
    }

    public isValid(): boolean {
        return this.getContent().length === this.getPosition().getRange().getLength();
    }

    public copy(): KvLiteral {
        return new KvLiteral(this.position, this.content);
    }
}

export class KvConditional extends KvLiteral {}

export class KvItem {
    private parent: KvItem | null;
    private key: KvLiteral;
    private children: KvItem[] | null;
    private values: KvLiteral[] | null;
    private condition: KvConditional | null;
    private openingBrace: KvLiteral | null;
    private closingBrace: KvLiteral | null;

    private constructor(key: KvLiteral, parent: KvItem | null, condition: KvConditional | null) {
        this.key = key;
        this.children = null;
        this.values = null;
        this.parent = parent;
        this.condition = condition;
        this.openingBrace = null;
        this.closingBrace = null;
    }

    public static createLeaf(
        parent: KvItem | null,
        key: KvLiteral,
        value: KvLiteral[],
        condition: KvConditional | null = null,
    ): KvItem {
        const item = new KvItem(key, parent, condition);
        item.values = value;
        return item;
    }

    public static createContainer(
        parent: KvItem | null,
        key: KvLiteral,
        children: KvItem[],
        condition: KvConditional | null = null,
    ): KvItem {
        const item = new KvItem(key, parent, condition);
        item.children = children;
        return item;
    }

    public copy(): KvItem {
        const item = new KvItem(this.key, this.parent, this.condition);
        item.values = this.values;
        item.children = this.children;
        return item;
    }

    public isLeaf(): boolean {
        return this.children == null && this.values != null;
    }

    public getValues(): KvLiteral[] | null {
        return this.values;
    }

    public getChildren(): KvItem[] | null {
        return this.children;
    }

    public getKey(): KvLiteral {
        return this.key;
    }

    public addChild(child: KvItem): void {
        if (this.children == null) {
            this.children = [];
        }
        this.children.push(child);
    }

    public replaceChildren(children: KvItem[]): void {
        this.children = children;
    }

    public getParent(): KvItem | null {
        return this.parent;
    }

    public isRoot(): boolean {
        return this.parent == null;
    }

    public getCondition(): KvConditional | null {
        return this.condition;
    }

    public hasCondition(): boolean {
        return this.condition != null;
    }

    public startPopulatingContainer(openingBrace: KvLiteral): void {
        this.openingBrace = openingBrace;
    }

    public endPopulatingContainer(closingBrace: KvLiteral): void {
        this.closingBrace = closingBrace;
    }

    public getOpeningBrace(): KvLiteral | null {
        return this.openingBrace;
    }

    public getClosingBrace(): KvLiteral | null {
        return this.closingBrace;
    }
}

export class KvDocument {
    private rootItems: KvItem[];
    private errors: KvParseError[];

    public constructor(rootItems: KvItem[], errors: KvParseError[]) {
        this.rootItems = rootItems;
        this.errors = errors;
    }

    public getRootItems(): KvItem[] {
        return this.rootItems;
    }

    public getErrors(): KvParseError[] {
        return this.errors;
    }

    public hasErrors(): boolean {
        return this.errors.length > 0;
    }
}

interface KvParserState {
    currentParent: KvItem | null;
    keyToken: KvToken | null;
    valueTokens: KvToken[];
    conditionToken: KvToken | null;

    errors: Array<KvParseError>;
    roots: Array<KvItem>;
}

export const KvParser = {
    parseText(text: string): KvDocument {
        const tokens = KvTokenizer.tokenize(text);
        const document = _parseTokensInternal(tokens);
        return document;
    },
    parseTokens(tokens: KvTokenList): KvDocument {
        return _parseTokensInternal(tokens);
    },
};

export function _parseTokensInternal(tokens: KvTokenList): KvDocument {
    const state = {
        conditionToken: null,
        currentParent: null,
        keyToken: null,
        valueTokens: [],
        errors: new Array<KvParseError>(),
        roots: new Array<KvItem>(),
    } as KvParserState;

    for (const token of tokens) {
        // Ignore comments
        if (token.type === KvTokenType.Comment) continue;

        // KV set is done
        completeOutstandingKvSet(state, token);

        if (token.type === KvTokenType.Key) {
            state.keyToken = token;
            state.valueTokens = [];
            continue;
        }

        if (token.type === KvTokenType.Value) {
            if (state.keyToken == null) {
                // This should never happen, but just in case.
                continue;
            }

            state.valueTokens.push(token);
            continue;
        }

        if (token.type === KvTokenType.ObjectStart) {
            if (state.keyToken == null) {
                const error = new KvParseError(KvParseErrorType.UnexpectedOpeningBrace, token.getPosition());
                state.errors.push(error);
                continue;
            }
            const key = state.keyToken.toLiteral();
            const condition: KvConditional | undefined = state.conditionToken?.toConditional();
            const item = KvItem.createContainer(state.currentParent, key, [], condition);
            item.startPopulatingContainer(token.toLiteral());

            if (state.currentParent == null) {
                state.currentParent = item;
                state.roots.push(item);
            } else {
                state.currentParent.addChild(item);
                state.currentParent = item;
            }

            state.keyToken = null;
            state.conditionToken = null;
            continue;
        }

        if (token.type === KvTokenType.ObjectEnd) {
            if (state.currentParent == null) {
                const error = new KvParseError(KvParseErrorType.UnexpectedClosingBrace, token.getPosition());
                state.errors.push(error);
            } else {
                state.currentParent.endPopulatingContainer(token.toLiteral());
                state.currentParent = state.currentParent.getParent();
            }

            continue;
        }

        if (token.type === KvTokenType.Conditional) {
            state.conditionToken = token;
            continue;
        }
    }

    if (state.keyToken != null) {
        if (state.currentParent == null) {
            const pos = getKvSetPosition(state);
            if (pos != null) {
                state.errors.push(new KvParseError(KvParseErrorType.MissingRootObject, pos));
            }
        }
    }

    return new KvDocument(state.roots, state.errors);
}

function getKvSetPosition(s: KvParserState): ParserPosition | null {
    if (s.keyToken == null) return null;
    let end: number;

    if (s.valueTokens.length > 0) {
        end = s.valueTokens[s.valueTokens.length - 1].range.getEnd();
    } else {
        end = s.keyToken.range.getEnd();
    }

    const range = new ParserRange(s.keyToken.range.getStart(), end);
    return new ParserPosition(s.keyToken.line, range);
}

function completeOutstandingKvSet(s: KvParserState, token: KvToken): void {
    if (s.keyToken == null || s.keyToken.line === token.line || token.type === KvTokenType.ObjectStart) return;

    if (s.valueTokens.length == 0) {
        const error = new KvParseError(KvParseErrorType.MissingValue, s.keyToken.getPosition());
        s.errors.push(error);
    }

    if (s.currentParent == null) {
        const pos = getKvSetPosition(s);
        if (pos != null) {
            s.errors.push(new KvParseError(KvParseErrorType.MissingRootObject, pos));
        }
    } else {
        const key = s.keyToken.toLiteral();
        const values = s.valueTokens.map((t) => new KvLiteral(new ParserPosition(t.line, t.range), t.value));
        const condition: KvConditional | undefined = s.conditionToken?.toConditional();
        const item = KvItem.createLeaf(s.currentParent, key, values, condition);
        s.currentParent.addChild(item);
    }

    s.keyToken = null;
    s.valueTokens = [];
    s.conditionToken = null;
}
