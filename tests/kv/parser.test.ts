import { test, expect, describe } from "vitest";
import { KvParser, KvParseErrorType } from "../../src/kv/KvParser";

describe("Parse Successes", () => {
    test("Parse Simple", () => {
        const kvFile = `Test { 
    "item1" "value1"
    "item2" "value2"

    "item3" {
        "item4" "value4"
    }

    "item5" {
        "item6" "value6"
        "item7" "value7"
    }
}`;
        const kvTree = KvParser.parseText(kvFile);

        expect(kvTree.getErrors().length).toBe(0);
        expect(kvTree.getRootItems().length).toBe(1);
        const root = kvTree.getRootItems()[0];
        expect(root.getKey().getContent()).toBe("Test");
        expect(root.getKey().getPosition().getLine()).toBe(0);
        expect(root.getKey().getPosition().getRange().getStart()).toBe(0);
        expect(root.getKey().getPosition().getRange().getEnd()).toBe(4);
        expect(root.getOpeningBrace()).not.toBeNull();
        expect(root.getOpeningBrace()!.getPosition().getLine()).toBe(0);
        expect(root.getOpeningBrace()!.getPosition().getRange().getStart()).toBe(5);
        expect(root.getOpeningBrace()!.getPosition().getRange().getEnd()).toBe(6);
        expect(root.getClosingBrace()).not.toBeNull();
        expect(root.getClosingBrace()!.getPosition().getLine()).toBe(12);
        expect(root.getClosingBrace()!.getPosition().getRange().getStart()).toBe(0);
        expect(root.getClosingBrace()!.getPosition().getRange().getEnd()).toBe(1);
        expect(root.hasCondition()).toBeFalsy();
        expect(root.getCondition()).toBeNull();
        expect(root.getChildren()).not.toBeNull();
        expect(root.getChildren()!.length).toBe(4);

        const item1 = root.getChildren()![0];
        expect(item1.isRoot()).toBeFalsy();
        expect(item1.isLeaf()).toBeTruthy();
        expect(item1.getParent()).toBe(root);
        expect(item1.getKey().getContent()).toBe('"item1"');
        expect(item1.getKey().getPosition().getLine()).toBe(1);
        expect(item1.getKey().getPosition().getRange().getStart()).toBe(4);
        expect(item1.getKey().getPosition().getRange().getEnd()).toBe(11);
        expect(item1.hasCondition()).toBeFalsy();
        expect(item1.getCondition()).toBeNull();
        expect(item1.getValues()).not.toBeNull();
        expect(item1.getValues()!.length).toBe(1);
        expect(item1.getValues()![0].getContent()).toBe('"value1"');
        expect(item1.getValues()![0].getPosition().getLine()).toBe(1);
        expect(item1.getValues()![0].getPosition().getRange().getStart()).toBe(12);
        expect(item1.getValues()![0].getPosition().getRange().getEnd()).toBe(20);

        const item2 = root.getChildren()![1];
        expect(item2.isRoot()).toBeFalsy();
        expect(item2.isLeaf()).toBeTruthy();
        expect(item2.getParent()).toBe(root);
        expect(item2.getKey().getContent()).toBe('"item2"');
        expect(item2.getKey().getPosition().getLine()).toBe(2);
        expect(item2.getKey().getPosition().getRange().getStart()).toBe(4);
        expect(item2.getKey().getPosition().getRange().getEnd()).toBe(11);
        expect(item2.hasCondition()).toBeFalsy();
        expect(item2.getCondition()).toBeNull();
        expect(item2.getValues()).not.toBeNull();
        expect(item2.getValues()!.length).toBe(1);
        expect(item2.getValues()![0].getContent()).toBe('"value2"');
        expect(item2.getValues()![0].getPosition().getLine()).toBe(2);
        expect(item2.getValues()![0].getPosition().getRange().getStart()).toBe(12);
        expect(item2.getValues()![0].getPosition().getRange().getEnd()).toBe(20);

        const item3 = root.getChildren()![2];
        expect(item3.isRoot()).toBeFalsy();
        expect(item3.isLeaf()).toBeFalsy();
        expect(item3.getParent()).toBe(root);
        expect(item3.getKey().getContent()).toBe('"item3"');
        expect(item3.getKey().getPosition().getLine()).toBe(4);
        expect(item3.getKey().getPosition().getRange().getStart()).toBe(4);
        expect(item3.getKey().getPosition().getRange().getEnd()).toBe(11);
        expect(item3.hasCondition()).toBeFalsy();
        expect(item3.getCondition()).toBeNull();
        expect(item3.getValues()).toBeNull();
        expect(item3.getChildren()).not.toBeNull();
        expect(item3.getChildren()!.length).toBe(1);

        const item4 = item3.getChildren()![0];
        expect(item4.isRoot()).toBeFalsy();
        expect(item4.isLeaf()).toBeTruthy();
        expect(item4.getParent()).toBe(item3);
        expect(item4.getKey().getContent()).toBe('"item4"');
        expect(item4.getKey().getPosition().getLine()).toBe(5);
        expect(item4.getKey().getPosition().getRange().getStart()).toBe(8);
        expect(item4.getKey().getPosition().getRange().getEnd()).toBe(15);
        expect(item4.hasCondition()).toBeFalsy();
        expect(item4.getCondition()).toBeNull();
        expect(item4.getValues()).not.toBeNull();
        expect(item4.getValues()!.length).toBe(1);
        expect(item4.getValues()![0].getContent()).toBe('"value4"');
        expect(item4.getValues()![0].getPosition().getLine()).toBe(5);
        expect(item4.getValues()![0].getPosition().getRange().getStart()).toBe(16);
        expect(item4.getValues()![0].getPosition().getRange().getEnd()).toBe(24);

        const item5 = root.getChildren()![3];
        expect(item5.isRoot()).toBeFalsy();
        expect(item5.isLeaf()).toBeFalsy();
        expect(item5.getParent()).toBe(root);
        expect(item5.getKey().getContent()).toBe('"item5"');
        expect(item5.getKey().getPosition().getLine()).toBe(8);
        expect(item5.getKey().getPosition().getRange().getStart()).toBe(4);
        expect(item5.getKey().getPosition().getRange().getEnd()).toBe(11);
        expect(item5.hasCondition()).toBeFalsy();
        expect(item5.getCondition()).toBeNull();
        expect(item5.getValues()).toBeNull();
        expect(item5.getChildren()).not.toBeNull();
        expect(item5.getChildren()!.length).toBe(2);

        const item6 = item5.getChildren()![0];
        expect(item6.isRoot()).toBeFalsy();
        expect(item6.isLeaf()).toBeTruthy();
        expect(item6.getParent()).toBe(item5);
        expect(item6.getKey().getContent()).toBe('"item6"');
        expect(item6.getKey().getPosition().getLine()).toBe(9);
        expect(item6.getKey().getPosition().getRange().getStart()).toBe(8);
        expect(item6.getKey().getPosition().getRange().getEnd()).toBe(15);
        expect(item6.hasCondition()).toBeFalsy();
        expect(item6.getCondition()).toBeNull();
        expect(item6.getValues()).not.toBeNull();
        expect(item6.getValues()!.length).toBe(1);
        expect(item6.getValues()![0].getContent()).toBe('"value6"');
        expect(item6.getValues()![0].getPosition().getLine()).toBe(9);
        expect(item6.getValues()![0].getPosition().getRange().getStart()).toBe(16);
        expect(item6.getValues()![0].getPosition().getRange().getEnd()).toBe(24);

        const item7 = item5.getChildren()![1];
        expect(item7.isRoot()).toBeFalsy();
        expect(item7.isLeaf()).toBeTruthy();
        expect(item7.getParent()).toBe(item5);
        expect(item7.getKey().getContent()).toBe('"item7"');
        expect(item7.getKey().getPosition().getLine()).toBe(10);
        expect(item7.getKey().getPosition().getRange().getStart()).toBe(8);
        expect(item7.getKey().getPosition().getRange().getEnd()).toBe(15);
        expect(item7.hasCondition()).toBeFalsy();
        expect(item7.getCondition()).toBeNull();
        expect(item7.getValues()).not.toBeNull();
        expect(item7.getValues()!.length).toBe(1);
        expect(item7.getValues()![0].getContent()).toBe('"value7"');
        expect(item7.getValues()![0].getPosition().getLine()).toBe(10);
        expect(item7.getValues()![0].getPosition().getRange().getStart()).toBe(16);
        expect(item7.getValues()![0].getPosition().getRange().getEnd()).toBe(24);
    });

    test("Parse compile time report", () => {
        const kvFile = `"report" 
    {
        "total_seconds"		"12"
    }
    `;
        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getErrors().length).toBe(0);
        expect(kvTree.getRootItems().length).toBe(1);

        const root = kvTree.getRootItems()[0];
        expect(root.isRoot()).toBeTruthy();
        expect(root.isLeaf()).toBeFalsy();
        expect(root.getKey().getContent()).toBe('"report"');

        const children = root.getChildren()!;
        expect(children).not.toBeNull();
        expect(children.length).toBe(1);
        const item1 = children[0];
        expect(item1.isLeaf()).toBeTruthy();
        expect(item1.isRoot()).toBeFalsy();
        expect(item1.getKey().getContent()).toBe('"total_seconds"');
        expect(item1.getValues()).not.toBeNull();
        expect(item1.getValues()!.length).toBe(1);
        expect(item1.getValues()![0].getContent()).toBe('"12"');
    });

    test("With Conditional", () => {
        const kvFile = `Test {
    "item1" "value1" [$Debug]

    "container" [$Debug2] {
        "item2" "value2"
    }
}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getErrors().length).toBe(0);
        const root = kvTree.getRootItems()[0];
        expect(root.hasCondition()).toBeFalsy();
        expect(root.getCondition()).toBeNull();

        const item1 = root.getChildren()![0];
        expect(item1.hasCondition()).toBeTruthy();
        expect(item1.getCondition()!.getContent()).toBe("[$Debug]");

        const container = root.getChildren()![1];
        expect(container.hasCondition()).toBeTruthy();
        expect(container.getCondition()!.getContent()).toBe("[$Debug2]");
        expect(container.getChildren()![0].hasCondition()).toBeFalsy();
        expect(container.getChildren()![0].getCondition()).toBeNull();
    });

    test("With Multiple Roots", () => {
        const kvFile = `Test1 {
    "item1" "value1"
}
Test2 {
    "item2" "value2"
}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getErrors().length).toBe(0);
        expect(kvTree.getRootItems().length).toBe(2);
        const root1 = kvTree.getRootItems()[0];
        expect(root1.getKey().getContent()).toBe("Test1");
        expect(root1.getChildren()!.length).toBe(1);
        expect(root1.getChildren()![0].getKey().getContent()).toBe('"item1"');
        expect(root1.getChildren()![0].getValues()![0].getContent()).toBe('"value1"');
        const root2 = kvTree.getRootItems()[1];
        expect(root2.getKey().getContent()).toBe("Test2");
        expect(root2.getChildren()!.length).toBe(1);
        expect(root2.getChildren()![0].getKey().getContent()).toBe('"item2"');
        expect(root2.getChildren()![0].getValues()![0].getContent()).toBe('"value2"');
    });

    test("With Multiple Values", () => {
        const kvFile = `Test {
    "item1" "value1" "value2"
}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getRootItems().length).toBe(1);
        const root = kvTree.getRootItems()[0];
        expect(root.getKey().getContent()).toBe("Test");
        expect(root.getChildren()!.length).toBe(1);
        expect(root.getChildren()![0].getKey().getContent()).toBe('"item1"');
        expect(root.getChildren()![0].getValues()!.length).toBe(2);
        expect(root.getChildren()![0].getValues()![0].getContent()).toBe('"value1"');
        expect(root.getChildren()![0].getValues()![1].getContent()).toBe('"value2"');
    });

    test("With Comments", () => {
        const kvFile = `// Comment
Test {
    // an item
    "item" val // a very important item
} // hi
`;
        const kvTree = KvParser.parseText(kvFile);

        expect(kvTree.hasErrors()).toBeFalsy();
        expect(kvTree.getRootItems().length).toBe(1);
        const root = kvTree.getRootItems()[0];
        expect(root.getKey().getContent()).toBe("Test");
        expect(root.isLeaf()).toBeFalsy();
        expect(root.getChildren()!.length).toBe(1);
        const item = root.getChildren()![0];
        expect(item.getKey().getContent()).toBe('"item"');
    });
});

describe("Parse Errors", () => {
    test("Error: No Root", () => {
        const kvFile = `"key" "value"

"Elem" {
    "legalkey" "legalvalue"
}

"key2" "value2"
`;
        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getRootItems().length).toBe(1);
        expect(kvTree.getErrors().length).toBe(2);

        const err1 = kvTree.getErrors()[0];
        expect(err1.type).toBe(KvParseErrorType.MissingRootObject);
        expect(err1.position.getLine()).toBe(0);
        expect(err1.position.getRange().getStart()).toBe(0);
        expect(err1.position.getRange().getEnd()).toBe(13);

        const err2 = kvTree.getErrors()[1];
        expect(err2.type).toBe(KvParseErrorType.MissingRootObject);
        expect(err2.position.getLine()).toBe(6);
        expect(err2.position.getRange().getStart()).toBe(0);
        expect(err2.position.getRange().getEnd()).toBe(15);
    });

    test("Error: No Values", () => {
        const kvFile = `Tests {
    key1
    key2

    key3 value1
}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getRootItems().length).toBe(1);
        expect(kvTree.getErrors().length).toBe(2);

        const root = kvTree.getRootItems()[0];
        expect(root.isRoot()).toBeTruthy();
        expect(root.isLeaf()).toBeFalsy();
        expect(root.getChildren()!.length).toBe(3);

        const item1 = root.getChildren()![0];
        expect(item1.isLeaf()).toBeTruthy();
        expect(item1.getKey().getContent()).toBe("key1");
        expect(item1.getValues()!.length).toBe(0);

        const item2 = root.getChildren()![1];
        expect(item2.isLeaf()).toBeTruthy();
        expect(item2.getKey().getContent()).toBe("key2");
        expect(item2.getValues()!.length).toBe(0);

        const item3 = root.getChildren()![2];
        expect(item3.isLeaf()).toBeTruthy();
        expect(item3.getKey().getContent()).toBe("key3");
        expect(item3.getValues()!.length).toBe(1);

        const errors = kvTree.getErrors();
        expect(errors[0].type).toBe(KvParseErrorType.MissingValue);
        expect(errors[0].position.getLine()).toBe(1);
        expect(errors[0].position.getRange().getStart()).toBe(4);
        expect(errors[0].position.getRange().getEnd()).toBe(8);
        expect(errors[1].type).toBe(KvParseErrorType.MissingValue);
        expect(errors[1].position.getLine()).toBe(2);
        expect(errors[1].position.getRange().getStart()).toBe(4);
        expect(errors[1].position.getRange().getEnd()).toBe(8);
    });

    test("Error: Unexpected Opening Brace", () => {
        const kvFile = `Test {
    {


}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getRootItems().length).toBe(1);
        expect(kvTree.getErrors().length).toBe(1);
        const err = kvTree.getErrors()[0];
        expect(err.type).toBe(KvParseErrorType.UnexpectedOpeningBrace);
        expect(err.position.getLine()).toBe(1);
        expect(err.position.getRange().getStart()).toBe(4);
        expect(err.position.getRange().getEnd()).toBe(5);
    });

    test("Error: Unexpected Closing Brace", () => {
        const kvFile = `Test {
    "key" "value"
    }
}`;

        const kvTree = KvParser.parseText(kvFile);
        expect(kvTree.getRootItems().length).toBe(1);
        expect(kvTree.getErrors().length).toBe(1);
        const err = kvTree.getErrors()[0];
        expect(err.type).toBe(KvParseErrorType.UnexpectedClosingBrace);
        expect(err.position.getLine()).toBe(3);
        expect(err.position.getRange().getStart()).toBe(0);
        expect(err.position.getRange().getEnd()).toBe(1);
    });
});
