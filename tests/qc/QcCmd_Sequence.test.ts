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

test("Qc Command $sequence - inline activity", () => {
    const doc = QcParser.parseText(`$sequence "idle" "anims/idle" fps 30 activity ACT_IDLE 1`);
    const ctx = doc.commands.find((c) => c.command === QcCommand.Sequence)!.content as QcCommandContext_Sequence;
    expect(ctx).toBeDefined();
    expect(ctx.name).toBe("idle");
    expect(ctx.fps).toBe(30);

    expect(ctx.references).toBeDefined();
    expect(ctx.references).toHaveLength(1);
    expect(ctx.references[0]).toBe("anims/idle");

    expect(ctx.activities).toBeDefined();
    expect(ctx.activities).toHaveLength(1);
    expect(ctx.activities[0]).toStrictEqual({ name: "ACT_IDLE", weight: 1 });
});

test("Qc Command $sequence - door example ACT_DOOR_OPEN", () => {
    const doc = QcParser.parseText(
        `$sequence "open" "anims/lever_open" fps 30 activity ACT_DOOR_OPEN 1 { event 1 8 } addlayer openbar`,
    );
    const ctx = doc.commands.find((c) => c.command === QcCommand.Sequence)!.content as QcCommandContext_Sequence;
    expect(ctx).toBeDefined();
    expect(ctx.name).toBe("open");
    expect(ctx.fps).toBe(30);

    expect(ctx.references).toBeDefined();
    expect(ctx.references).toHaveLength(1);
    expect(ctx.references[0]).toBe("anims/lever_open");

    expect(ctx.activities).toBeDefined();
    expect(ctx.activities).toHaveLength(1);
    expect(ctx.activities[0]).toStrictEqual({ name: "ACT_DOOR_OPEN", weight: 1 });

    expect(ctx.events).toBeDefined();
    expect(ctx.events).toHaveLength(1);
    expect(ctx.events[0]).toStrictEqual({ name: "1", frame: 8 });

    expect(ctx.autoLayers).toBeDefined();
    expect(ctx.autoLayers).toHaveLength(1);
    expect(ctx.autoLayers[0]).toStrictEqual({ name: "openbar", flags: [] });
});
