import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcCommand } from "../../src/qc/QcCommands";
import { QcCommandContext_Body } from "../../src/qc/commands/QcCmd_Body";

test("Qc Command $body - simple", () => {
    const doc = QcParser.parseText(`$body "body" "some_mesh.smd"`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Body)!.content as QcCommandContext_Body;
    expect(ctx).toBeDefined();
    expect(ctx.skinName).toBe("body");

    expect(ctx.studio).toBeDefined();
    expect(ctx.studio.fileName).toBe("some_mesh.smd");
    expect(ctx.studio.reverse).toBeUndefined();
    expect(ctx.studio.scale).toBeUndefined();
    expect(ctx.studio.subd).toBeUndefined();
});

test("Qc Command $body - More studio options", () => {
    const doc = QcParser.parseText(`$body "body" "some_mesh.smd" reverse scale 2.0`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Body)!.content as QcCommandContext_Body;
    expect(ctx).toBeDefined();
    expect(ctx.skinName).toBe("body");

    expect(ctx.studio).toBeDefined();
    expect(ctx.studio.fileName).toBe("some_mesh.smd");
    expect(ctx.studio.reverse).toBe(true);
    expect(ctx.studio.scale).toBe(2.0);
    expect(ctx.studio.subd).toBeUndefined();
});
