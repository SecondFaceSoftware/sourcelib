import { test, expect, describe } from "vitest";
import { KvLiteral, KvItem } from "../../src/kv/KvParser";
import { ParserPosition, ParserRange } from "../../src/_shared/SharedParser";

describe("ParserRange", () => {
    test("Construct valid Success", () => {
        expect(() => {
            new ParserRange(1, 2);
        }).not.toThrow();
    });
    test("Construct less than zero start Fail", () => {
        expect(() => {
            new ParserRange(-1, 2);
        }).toThrowError();
    });
    test("Construct end less than start Fail", () => {
        expect(() => {
            new ParserRange(3, 2);
        }).toThrowError();
    });
    test("Construct float start Fail", () => {
        expect(() => {
            new ParserRange(3.3, 2);
        }).toThrowError();
    });
    test("Construct float end Fail", () => {
        expect(() => {
            new ParserRange(1, 2.4);
        }).toThrowError();
    });

    test("ParserRange intersecting Success", () => {
        const ParserRange1 = new ParserRange(0, 5);
        const ParserRange2 = new ParserRange(3, 10);
        expect(ParserRange1.isIntersecting(ParserRange2)).toBe(true);
        expect(ParserRange2.isIntersecting(ParserRange1)).toBe(true);
    });

    test("ParserRange intersecting Fail", () => {
        const ParserRange1 = new ParserRange(0, 5);
        const ParserRange2 = new ParserRange(6, 10);
        expect(ParserRange1.isIntersecting(ParserRange2)).toBe(false);
        expect(ParserRange2.isIntersecting(ParserRange1)).toBe(false);
    });

    test("Item create leaf Success", () => {
        const key = new KvLiteral(new ParserPosition(0, new ParserRange(0, 5)), "item1");
        const values = [new KvLiteral(new ParserPosition(0, new ParserRange(6, 10)), "value1")];
        const item1 = KvItem.createLeaf(null, key, values);
        expect(item1.isLeaf()).toBe(true);
        expect(item1.getValues()).toEqual(values);
        expect(item1.getKey().getContent()).toBe("item1");
    });
});

describe("KvLiteral", () => {
    test("KvLiteral getUnquoted Success", () => {
        const literal = new KvLiteral(new ParserPosition(0, new ParserRange(0, 6)), '"TEST"');
        const literalContent = literal.asUnquoted();

        // Ensure that original literal didn't mutate
        expect(literal.getContent()).toBe('"TEST"');
        expect(literal.getPosition().getLine()).toBe(0);
        expect(literal.getPosition().getRange().getStart()).toBe(0);
        expect(literal.getPosition().getRange().getEnd()).toBe(6);

        expect(literalContent.getContent()).toBe("TEST");
        expect(literalContent.getPosition().getLine()).toBe(0);
        expect(literalContent.getPosition().getRange().getStart()).toBe(1);
        expect(literalContent.getPosition().getRange().getEnd()).toBe(5);
    });

    test("KvLiteral isValid Success", () => {
        const literal = new KvLiteral(new ParserPosition(1, new ParserRange(3, 10)), "Success");

        expect(literal.isValid()).toBe(true);
    });

    test("KvLiteral isValid Fail", () => {
        const literal = new KvLiteral(new ParserPosition(1, new ParserRange(3, 11)), "Success");

        expect(literal.isValid()).toBe(false);
    });
});
