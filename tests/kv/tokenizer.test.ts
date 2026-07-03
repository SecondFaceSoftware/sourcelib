import { expect, test } from "vitest";
import { KvTokenizer } from "../../src/kv/KvTokenizer";
import { TokenType } from "../../src/kv/KvParser";
import { SharedTokenizer } from "../../src/_shared/SharedTokenizer";

test("Tokenize Simple KV", () => {
    const tokens = KvTokenizer.tokenize(
        `"File"
{
    "Keyvalues" {

        // A comment
    
\t\t"Quoted Strings"         "a a"  // Comment after the line
        unquoted_strings        b       // Unquoted strings cannot have spaces
    
        integers                130     // 130
        floats                  5.03    // 
        in_brackets             500.3
    
        "booleans"     \t"true"    //
        booleans                "false"   //
    
        array        \t     "[1.0 0.5 0.0]"     //gf
        
\tmatrix                  "{255 128 0}"       // {}
    
    
        "Subobject" { // yes {}]]}}}}
            "key"               "value"

            "single quote"      "'"
    
            " string"   "fsdf"
        }
    
        Unquoted
        {
            key val
        }
    
    }

    more                  {

        hello "\\"world\\""

    }
}`,
    );
    expect(tokens).toBeDefined();
    expect(tokens.length).toBe(53);

    expect(tokens[0].value).toBe('"File"');
    expect(tokens[0].type).toBe(TokenType.Key);
    expect(tokens[0].line).toBe(0);
    expect(tokens[0].range.getStart()).toBe(0);
    expect(tokens[0].range.getEnd()).toBe(6);
    expect(tokens[1].value).toBe("{");
    expect(tokens[1].type).toBe(TokenType.ObjectStart);
    expect(tokens[1].line).toBe(1);
    expect(tokens[1].range.getStart()).toBe(0);
    expect(tokens[1].range.getEnd()).toBe(1);
    expect(tokens[2].value).toBe('"Keyvalues"');
    expect(tokens[2].type).toBe(TokenType.Key);
    expect(tokens[2].line).toBe(2);
    expect(tokens[2].range.getStart()).toBe(4);
    expect(tokens[2].range.getEnd()).toBe(15);
    expect(tokens[3].value).toBe("{");
    expect(tokens[3].type).toBe(TokenType.ObjectStart);
    expect(tokens[3].line).toBe(2);
    expect(tokens[3].range.getStart()).toBe(16);
    expect(tokens[3].range.getEnd()).toBe(17);
    expect(tokens[4].value).toBe("// A comment");
    expect(tokens[4].type).toBe(TokenType.Comment);
    expect(tokens[4].line).toBe(4);
    expect(tokens[4].range.getStart()).toBe(8);
    expect(tokens[4].range.getEnd()).toBe(20);
    expect(tokens[5].value).toBe('"Quoted Strings"');
    expect(tokens[5].line).toBe(6);
    expect(tokens[5].type).toBe(TokenType.Key);
    expect(tokens[6].value).toBe('"a a"');
    expect(tokens[6].line).toBe(6);
    expect(tokens[6].type).toBe(TokenType.Value);
    expect(tokens[7].value).toBe("// Comment after the line");
    expect(tokens[7].line).toBe(6);

    expect(tokens[50].type).toBe(TokenType.Value);
    expect(tokens[50].value).toBe('"\\"world\\""');
});

test("Tokenize preprocessor", () => {
    const tokens = KvTokenizer.tokenize(`
    // Example file for a file with preprocessor statements
    
    #base "file_this_is_based_on.txt"
    
    "Obj" {
        #include "some/file.txt"
        "hello" "world :)"
    }`);

    expect(tokens.length).toBe(10);
    expect(tokens[0].type).toBe(TokenType.Comment);
    expect(tokens[1].type).toBe(TokenType.PreprocessorKey);
    expect(tokens[2].type).toBe(TokenType.Value);
    expect(tokens[3].type).toBe(TokenType.Key);
    expect(tokens[4].type).toBe(TokenType.ObjectStart);
    expect(tokens[5].type).toBe(TokenType.PreprocessorKey);
    expect(tokens[6].type).toBe(TokenType.Value);
    expect(tokens[7].type).toBe(TokenType.Key);
    expect(tokens[8].type).toBe(TokenType.Value);
    expect(tokens[9].type).toBe(TokenType.ObjectEnd);
});

test("Tokenize missing closing quote on string", () => {
    const tokens = KvTokenizer.tokenize(`
    "test" {
        "key1" value1
        "key2" "value2
        "key3" value3"
        "key4 value4

        key5 value5
    }`);

    expect(tokens.length).toBe(12);
    expect(tokens[2].type).toBe(TokenType.Key);
    expect(tokens[2].value).toBe('"key1"');
    expect(tokens[3].type).toBe(TokenType.Value);
    expect(tokens[3].value).toBe("value1");

    expect(tokens[4].type).toBe(TokenType.Key);
    expect(tokens[4].value).toBe('"key2"');
    expect(tokens[5].type).toBe(TokenType.Value);
    expect(tokens[5].value).toBe('"value2');

    expect(tokens[6].type).toBe(TokenType.Key);
    expect(tokens[6].value).toBe('"key3"');
    expect(tokens[7].type).toBe(TokenType.Value);
    expect(tokens[7].value).toBe('value3"');

    expect(tokens[8].type).toBe(TokenType.Key);
    expect(tokens[8].value).toBe('"key4 value4');

    expect(tokens[9].type).toBe(TokenType.Key);
    expect(tokens[9].value).toBe("key5");
    expect(tokens[10].type).toBe(TokenType.Value);
    expect(tokens[10].value).toBe("value5");
});

test("Tokenize multiple values", () => {
    const tokens = KvTokenizer.tokenize(`Test {
        "key1" "v1" v2 v3 4 // comment
    }`);

    expect(tokens.length).toBe(9);
    expect(tokens[0].type).toBe(TokenType.Key);
    expect(tokens[1].type).toBe(TokenType.ObjectStart);
    expect(tokens[2].type).toBe(TokenType.Key);
    expect(tokens[3].type).toBe(TokenType.Value);
    expect(tokens[3].value).toBe('"v1"');
    expect(tokens[4].type).toBe(TokenType.Value);
    expect(tokens[4].value).toBe("v2");
    expect(tokens[5].type).toBe(TokenType.Value);
    expect(tokens[5].value).toBe("v3");
    expect(tokens[6].type).toBe(TokenType.Value);
    expect(tokens[6].value).toBe("4");
});

test("Tokenize conditionals", () => {
    const tokens = KvTokenizer.tokenize(`Test {
        "k1" "v1" [$TEST]
        "k2" "v2" [ $TEST && ( !$DEBUG ) ]
    }`);

    expect(tokens.length).toBe(9);
    expect(tokens[0].type).toBe(TokenType.Key);
    expect(tokens[1].type).toBe(TokenType.ObjectStart);
    expect(tokens[2].type).toBe(TokenType.Key);
    expect(tokens[3].type).toBe(TokenType.Value);
    expect(tokens[4].type).toBe(TokenType.Conditional);
    expect(tokens[4].value).toBe("[$TEST]");
    expect(tokens[5].type).toBe(TokenType.Key);
    expect(tokens[5].value).toBe('"k2"');
    expect(tokens[6].type).toBe(TokenType.Value);
    expect(tokens[7].type).toBe(TokenType.Conditional);
    expect(tokens[7].value).toBe("[ $TEST && ( !$DEBUG ) ]");
});

test("Tokenize conditionals on object", () => {
    const tokens = KvTokenizer.tokenize(`Test {
        "kv1" "v1"

        Obj [$DEBUG]
        {
            "kv2" "v2"
        }

        Obj2 [$Debug] {
            "kv2" "v2"
        }
    }`);

    expect(tokens.length).toBe(17);
    expect(tokens[0].type).toBe(TokenType.Key);
    expect(tokens[1].type).toBe(TokenType.ObjectStart);
    expect(tokens[2].type).toBe(TokenType.Key);
    expect(tokens[3].type).toBe(TokenType.Value);
    expect(tokens[4].type).toBe(TokenType.Key);
    expect(tokens[5].type).toBe(TokenType.Conditional);
    expect(tokens[6].type).toBe(TokenType.ObjectStart);
    expect(tokens[7].type).toBe(TokenType.Key);
    expect(tokens[8].type).toBe(TokenType.Value);
    expect(tokens[9].type).toBe(TokenType.ObjectEnd);
    expect(tokens[10].type).toBe(TokenType.Key);
    expect(tokens[11].type).toBe(TokenType.Conditional);
    expect(tokens[12].type).toBe(TokenType.ObjectStart);
    expect(tokens[13].type).toBe(TokenType.Key);
    expect(tokens[14].type).toBe(TokenType.Value);
    expect(tokens[15].type).toBe(TokenType.ObjectEnd);
    expect(tokens[16].type).toBe(TokenType.ObjectEnd);
});

test("Consume Unquoted string", () => {
    let text = "hello_this_is_an_unquoted_string";
    expect(SharedTokenizer.consumeStringUnquoted(text, 0)).toBe(text.length + 1);

    text = "key value";
    expect(SharedTokenizer.consumeStringUnquoted(text, 0)).toBe(4);
    expect(SharedTokenizer.consumeStringUnquoted(text, 4)).toBe(6);
});

// To fix https://github.com/source-lib/sourcelib/issues/1
test("Error when / is not followed by any character", () => {
    const kvFile = `Test {
    "key1" "v1" /`;

    expect(() => {
        KvTokenizer.tokenize(kvFile);
    }).not.toThrowError();
});

test("Tokenize compile time report", () => {
    const kvFile = `"report" 
{
	"total_seconds"		"12"
}
`;
    KvTokenizer.tokenize(kvFile);
});
