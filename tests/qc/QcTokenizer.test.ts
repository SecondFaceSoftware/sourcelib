import { expect, test } from "vitest";
import { QcTokenizer, QcTokenTypes } from "../../src/qc/QcTokenizer";

test("Tokenize static prop QC", () => {
    const tokens = QcTokenizer.tokenizeText(`
// this is a comment
; this is also a comment
# and so is this
$modelname "_hr/props_office/desk_curved.mdl"

$body "body" "desk_curved.smd"

$cdmaterials "_hr/models/props_office"

$staticprop

$sequence "idle" "desk_curved.smd"

$collisionmodel "desk_curved_phys.smd"
{
    $mass 200
    $concave
}

$texturegroup "skins"
{
    { "desk_curved" }
    { "desk_curved_skin1" }
    { "desk_curved_skin2" }
    { "desk_curved_skin3" }
}`);

    let n = 0;
    expect(tokens).toBeDefined();
    expect(tokens).toHaveLength(37);
    expect(tokens[n].type).toBe(QcTokenTypes.Comment);
    expect(tokens[n].line).toBe(1);
    expect(tokens[n].value).toBe("// this is a comment");
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(20);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Comment);
    expect(tokens[n].line).toBe(2);
    expect(tokens[n].value).toBe("; this is also a comment");
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(24);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Comment);
    expect(tokens[n].line).toBe(3);
    expect(tokens[n].value).toBe("# and so is this");
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(16);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(4);
    expect(tokens[n].value).toBe("$modelname");
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(10);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(4);
    expect(tokens[n].value).toBe(`"_hr/props_office/desk_curved.mdl"`);
    expect(tokens[n].range.start).toBe(11);
    expect(tokens[n].range.end).toBe(45);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(6);
    expect(tokens[n].value).toBe(`$body`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(5);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(6);
    expect(tokens[n].value).toBe(`"body"`);
    expect(tokens[n].range.start).toBe(6);
    expect(tokens[n].range.end).toBe(12);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(6);
    expect(tokens[n].value).toBe(`"desk_curved.smd"`);
    expect(tokens[n].range.start).toBe(13);
    expect(tokens[n].range.end).toBe(30);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(8);
    expect(tokens[n].value).toBe("$cdmaterials");
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(12);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(8);
    expect(tokens[n].value).toBe(`"_hr/models/props_office"`);
    expect(tokens[n].range.start).toBe(13);
    expect(tokens[n].range.end).toBe(38);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(10);
    expect(tokens[n].value).toBe(`$staticprop`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(11);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(12);
    expect(tokens[n].value).toBe(`$sequence`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(9);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(12);
    expect(tokens[n].value).toBe(`"idle"`);
    expect(tokens[n].range.start).toBe(10);
    expect(tokens[n].range.end).toBe(16);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(12);
    expect(tokens[n].value).toBe(`"desk_curved.smd"`);
    expect(tokens[n].range.start).toBe(17);
    expect(tokens[n].range.end).toBe(34);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(14);
    expect(tokens[n].value).toBe(`$collisionmodel`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(15);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(14);
    expect(tokens[n].value).toBe(`"desk_curved_phys.smd"`);
    expect(tokens[n].range.start).toBe(16);
    expect(tokens[n].range.end).toBe(38);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(15);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(1);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(16);
    expect(tokens[n].value).toBe(`$mass`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(9);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(16);
    expect(tokens[n].value).toBe(`200`);
    expect(tokens[n].range.start).toBe(10);
    expect(tokens[n].range.end).toBe(13);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(17);
    expect(tokens[n].value).toBe(`$concave`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(12);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(18);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(1);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.Command);
    expect(tokens[n].line).toBe(20);
    expect(tokens[n].value).toBe(`$texturegroup`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(13);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(20);
    expect(tokens[n].value).toBe(`"skins"`);
    expect(tokens[n].range.start).toBe(14);
    expect(tokens[n].range.end).toBe(21);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(21);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(1);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(22);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(5);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(22);
    expect(tokens[n].value).toBe(`"desk_curved"`);
    expect(tokens[n].range.start).toBe(6);
    expect(tokens[n].range.end).toBe(19);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(22);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(20);
    expect(tokens[n].range.end).toBe(21);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(23);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(5);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(23);
    expect(tokens[n].value).toBe(`"desk_curved_skin1"`);
    expect(tokens[n].range.start).toBe(6);
    expect(tokens[n].range.end).toBe(25);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(23);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(26);
    expect(tokens[n].range.end).toBe(27);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(24);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(5);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(24);
    expect(tokens[n].value).toBe(`"desk_curved_skin2"`);
    expect(tokens[n].range.start).toBe(6);
    expect(tokens[n].range.end).toBe(25);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(24);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(26);
    expect(tokens[n].range.end).toBe(27);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.ScopeStart);
    expect(tokens[n].line).toBe(25);
    expect(tokens[n].value).toBe(`{`);
    expect(tokens[n].range.start).toBe(4);
    expect(tokens[n].range.end).toBe(5);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.Literal);
    expect(tokens[n].line).toBe(25);
    expect(tokens[n].value).toBe(`"desk_curved_skin3"`);
    expect(tokens[n].range.start).toBe(6);
    expect(tokens[n].range.end).toBe(25);
    n++;
    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(25);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(26);
    expect(tokens[n].range.end).toBe(27);
    n++;

    expect(tokens[n].type).toBe(QcTokenTypes.ScopeEnd);
    expect(tokens[n].line).toBe(26);
    expect(tokens[n].value).toBe(`}`);
    expect(tokens[n].range.start).toBe(0);
    expect(tokens[n].range.end).toBe(1);
});
