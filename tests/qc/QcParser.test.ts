import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcCommand } from "../../src/qc/QcCommands";

test("Parse static prop QC", () => {
    const qcDocument = QcParser.parseText(`
$modelname "_hr/props_office/desk_curved.mdl"

$body "body" "desk_curved.smd"

$cdmaterials "_hr/models/props_office"

$staticprop

$sequence "idle" "desk_curved.smd"

$collisionmodel "desk_curved_phys.smd"
{
// this comment should not be in the content token array
    $mass 200
    $concave
}

$texturegroup "skins"
{
// this comment should not be in the content token array
    { "desk_curved" }
    { "desk_curved_skin1" }
    { "desk_curved_skin2" }
    { "desk_curved_skin3" }
}`);

    expect(qcDocument.commands).toBeDefined();
    expect(qcDocument.commands).toHaveLength(7);
    expect(qcDocument.commands[0].command).toBe(QcCommand.ModelName);
    expect(qcDocument.commands[0].content).toHaveLength(1);
    expect(qcDocument.commands[0].content[0].value).toBe(`"_hr/props_office/desk_curved.mdl"`);

    expect(qcDocument.commands[1].command).toBe(QcCommand.Body);
    expect(qcDocument.commands[1].content).toHaveLength(2);
    expect(qcDocument.commands[1].content[0].value).toBe(`"body"`);
    expect(qcDocument.commands[1].content[1].value).toBe(`"desk_curved.smd"`);

    expect(qcDocument.commands[2].command).toBe(QcCommand.CdMaterials);
    expect(qcDocument.commands[2].content).toHaveLength(1);
    expect(qcDocument.commands[2].content[0].value).toBe(`"_hr/models/props_office"`);

    expect(qcDocument.commands[3].command).toBe(QcCommand.StaticProp);
    expect(qcDocument.commands[3].content).toHaveLength(0);

    expect(qcDocument.commands[4].command).toBe(QcCommand.Sequence);
    expect(qcDocument.commands[4].content).toHaveLength(2);
    expect(qcDocument.commands[4].content[0].value).toBe(`"idle"`);
    expect(qcDocument.commands[4].content[1].value).toBe(`"desk_curved.smd"`);

    expect(qcDocument.commands[5].command).toBe(QcCommand.CollisionModel);
    expect(qcDocument.commands[5].content).toHaveLength(6);
    expect(qcDocument.commands[5].content[0].value).toBe(`"desk_curved_phys.smd"`);
    expect(qcDocument.commands[5].content[1].value).toBe(`{`);
    expect(qcDocument.commands[5].content[2].value).toBe(`$mass`);
    expect(qcDocument.commands[5].content[3].value).toBe(`200`);
    expect(qcDocument.commands[5].content[4].value).toBe(`$concave`);
    expect(qcDocument.commands[5].content[5].value).toBe(`}`);

    expect(qcDocument.commands[6].command).toBe(QcCommand.TextureGroup);
    expect(qcDocument.commands[6].content).toHaveLength(15);
    expect(qcDocument.commands[6].content[0].value).toBe(`"skins"`);
    expect(qcDocument.commands[6].content[1].value).toBe(`{`);
    expect(qcDocument.commands[6].content[2].value).toBe(`{`);
    expect(qcDocument.commands[6].content[3].value).toBe(`"desk_curved"`);
    expect(qcDocument.commands[6].content[4].value).toBe(`}`);
    expect(qcDocument.commands[6].content[5].value).toBe(`{`);
    expect(qcDocument.commands[6].content[6].value).toBe(`"desk_curved_skin1"`);
    expect(qcDocument.commands[6].content[7].value).toBe(`}`);
    expect(qcDocument.commands[6].content[8].value).toBe(`{`);
    expect(qcDocument.commands[6].content[9].value).toBe(`"desk_curved_skin2"`);
    expect(qcDocument.commands[6].content[10].value).toBe(`}`);
    expect(qcDocument.commands[6].content[11].value).toBe(`{`);
    expect(qcDocument.commands[6].content[12].value).toBe(`"desk_curved_skin3"`);
    expect(qcDocument.commands[6].content[13].value).toBe(`}`);
    expect(qcDocument.commands[6].content[14].value).toBe(`}`);
});
