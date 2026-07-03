import { test, expect } from "vitest";
import { QcCommand, QcTokenizer } from "../../src/qc/QcTokenizer";

test("Parse static prop QC", () => {
    const qcDocument = QcTokenizer.tokenizeText(`
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

    // expect(qcDocument.commands).toBeDefined();
    // expect(qcDocument.commands).toHaveLength(7);
    // expect(qcDocument.commands[0].command).toBe(QcCommand.ModelName);
    // expect(qcDocument.commands[1].command).toBe(QcCommand.Body);
    // expect(qcDocument.commands[2].command).toBe(QcCommand.CdMaterials);
    // expect(qcDocument.commands[3].command).toBe(QcCommand.StaticProp);
    // expect(qcDocument.commands[4].command).toBe(QcCommand.Sequence);
    // expect(qcDocument.commands[5].command).toBe(QcCommand.CollisionModel);
    // expect(qcDocument.commands[6].command).toBe(QcCommand.TextureGroup);
});
