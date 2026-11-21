import { expect, test } from "vitest";
import { QcParser } from "../../src/qc/QcParser";
import { QcUtils } from "../../src/qc/QcUtils";

test("Qc Command $modelname - simple success", () => {
    const doc = QcParser.parseText(`$modelname "_hr/moon/thing.mdl"`);
    expect(QcUtils.getModelName(doc)).toBe("_hr/moon/thing.mdl");
});

test("Qc Command $modelname - simple fail", () => {
    const doc = QcParser.parseText(`$modelname`);
    expect(QcUtils.getModelName(doc)).toBeUndefined();
});
