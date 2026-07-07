import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcCommand } from "../../src/qc/QcCommands";
import { QcCommandContext_CollisionModel } from "../../src/qc/commands/QcCmd_CollisionModel";

test("Qc Command $collisionmodel - simple", () => {
    const doc = QcParser.parseText(`$collisionmodel "some_mesh_phys.smd"`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.CollisionModel)!
        .content as QcCommandContext_CollisionModel;
    expect(ctx).toBeDefined();
    expect(ctx.file).toBe("some_mesh_phys.smd");
});

test("Qc Command $collisionmodel - more", () => {
    const doc = QcParser.parseText(`
$collisionmodel "some_mesh_phys.smd" {
    $mass 200
    $convex
    $maxconvexpieces 40
}`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.CollisionModel)!
        .content as QcCommandContext_CollisionModel;
    expect(ctx).toBeDefined();
    expect(ctx.file).toBe("some_mesh_phys.smd");
});

test("Qc Command $collisionjoints - more", () => {
    const doc = QcParser.parseText(`
$collisionjoints "some_mesh_phys.smd" {
    $mass 200
    $convex
    $maxconvexpieces 40
}`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.CollisionJoints)!
        .content as QcCommandContext_CollisionModel;
    expect(ctx).toBeDefined();
    expect(ctx.file).toBe("some_mesh_phys.smd");
});
