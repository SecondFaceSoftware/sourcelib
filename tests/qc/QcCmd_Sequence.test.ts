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
