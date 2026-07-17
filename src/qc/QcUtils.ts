import { QcCommand, QcDocument } from "./QcCommands.js";
import { QcCommandContext_CollisionModel } from "./commands/QcCmd_CollisionModel.js";
import { QcCommandContext_Body } from "./commands/QcCmd_Body.js";
import { QcCommandContext_Sequence } from "./commands/QcCmd_Sequence.js";

export const QcUtils = {
    /**
     * This is an experimental function and might not list all referenced assets or might list too many
     */
    getAllReferencedModelInputFiles(qcDocument: QcDocument): Set<string> {
        const refs = new Set<string>();

        for (const cmd of qcDocument.commands) {
            if (cmd.command === QcCommand.CollisionModel || cmd.command === QcCommand.CollisionJoints) {
                const content = cmd.content as QcCommandContext_CollisionModel;
                refs.add(content.file);
            }
            if (cmd.command === QcCommand.Body) {
                const content = cmd.content as QcCommandContext_Body;
                if (content.studio.fileName) {
                    refs.add(content.studio.fileName);
                }
            }
            if (cmd.command === QcCommand.Sequence) {
                const content = cmd.content as QcCommandContext_Sequence;
                for (const r of content.references) {
                    refs.add(r);
                }
            }
        }

        return refs;
    },
};
