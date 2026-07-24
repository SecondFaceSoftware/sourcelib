import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcCommand } from "../../src/qc/QcCommands";
import { QcCommandContext_Sequence } from "../../src/qc/commands/QcCmd_Sequence";

test("Qc Command $sequence - simple", () => {
    const doc = QcParser.parseText(`$sequence "idle" "idle.smd"`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Sequence)!.content as QcCommandContext_Sequence;
    expect(ctx).toBeDefined();
    expect(ctx.name).toBe("idle");
    expect(ctx.references).toBeDefined();
    expect(ctx.references).toHaveLength(1);
    expect(ctx.references[0]).toBe("idle.smd");
});

test("Qc Command $sequence - long line with no param tokens", () => {
    const doc = QcParser.parseText(`$sequence "idle" "idle.smd" loop snap noanimation`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Sequence)!.content as QcCommandContext_Sequence;
    expect(ctx).toBeDefined();
    expect(ctx.name).toBe("idle");
    expect(ctx.loop).toBe(true);
    expect(ctx.snap).toBe(true);
    expect(ctx.noAnimation).toBe(true);
    expect(ctx.worldRelative).toBeUndefined();
    expect(ctx.autoplay).toBeUndefined();
    expect(ctx.worldSpaceBlend).toBeUndefined();
    expect(ctx.references).toBeDefined();
    expect(ctx.references).toHaveLength(1);
    expect(ctx.references[0]).toBe("idle.smd");
});

test("Qc Command $sequence - long line with param tokens", () => {
    const doc = QcParser.parseText(`$sequence "idle" "idle.smd" frames 10 200`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Sequence)!.content as QcCommandContext_Sequence;
    expect(ctx).toBeDefined();
    expect(ctx.name).toBe("idle");
    expect(ctx.frames).toStrictEqual({ start: 10, end: 200 });
    expect(ctx.references).toBeDefined();
    expect(ctx.references).toHaveLength(1);
    expect(ctx.references[0]).toBe("idle.smd");
});
