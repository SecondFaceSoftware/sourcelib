import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcUtils } from "../../src/qc/QcUtils";

test("getAllReferencedModelInputFiles - simple", () => {
    const doc = QcParser.parseText(`
$body "body" "some_mesh.smd"
$collisionmodel "some_mesh_phys.smd"

$staticprop

$sequence "idle" "some_mesh.smd"
`);
    const files = QcUtils.getAllReferencedModelInputFiles(doc);
    expect(files).toEqual(new Set<string>(["some_mesh.smd", "some_mesh_phys.smd"]));
});
