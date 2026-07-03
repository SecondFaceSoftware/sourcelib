import { consumeComment, consumeString } from "../kv/KvTokenizer";

export enum QcCommand {
    Cd = "$cd",
    ModelName = "$modelname",
    InternalName = "$internalname",
    CdMaterials = "$cdmaterials",
    PushD = "$pushd",
    PopD = "$popd",
    Scale = "$scale",
    Root = "$root",
    Controller = "$controller",
    ScreenAlign = "$screenalign",
    WorldAlign = "$worldalign",
    KeepUpright = "$keepupright",
    Model = "$model",
    CollisionModel = "$collisionmodel",
    CollisionJoints = "$collisionjoints",
    CollisionText = "$collisiontext",
    AppendSource = "$appendsource",
    Body = "$body",
    PreferFbx = "$prefer_fbx",
    BodyGroup = "$bodygroup",
    AppendBlankBodyGroup = "$appendblankbodygroup",
    BodyGroupReset = "$bodygrouppreset",
    Animation = "$animation",
    AutoCenter = "$autocenter",
    Sequence = "$sequence",
    Append = "$append",
    Prepend = "$prepend",
    Continue = "$continue",
    DeclareSequence = "$declaresequence",
    DeclareAnimation = "$declareanimation",
    CmdList = "$cmdlist",
    AnimBlockSize = "$animblocksize",
    WeightList = "$weightlist",
    DefaultWeightList = "$defaultweightlist",
    IkChain = "$ikchain",
    IkAutoPlayLock = "$ikautoplaylock",
    EyePosition = "$eyeposition",
    IllumPosition = "$illumposition",
    Origin = "$origin",
    OriginBones = "$originbones",
    UpAxis = "$upaxis",
    BBox = "$bbox",
    BBoxOnlyVerts = "$bboxonlyverts",
    CBox = "$cbox",
    Gamma = "$gamma",
    TextureGroup = "$texturegroup",
    HGroup = "$hgroup",
    HBox = "$hbox",
    HBoxSet = "$hboxset",
    SurfaceProp = "$surfaceprop",
    JointSurfaceProp = "$jointsurfaceprop",
    Contents = "$contents",
    JointContents = "$jointcontents",
    Attachment = "$attachment",
    RedefineAttachment = "$redefineattachment",
    BoneMerge = "$bonemerge",
    BoneAlwaysSetup = "$bonealwayssetup",
    ExternalTextures = "$externaltextures",
    ClipToTextures = "$cliptotextures",
    SkinnedLods = "$skinnedLODs",
    RenameBone = "$renamebone",
    StripBonePrefix = "$stripboneprefix",
    RenameBoneSubstr = "$renamebonesubstr",
    CollapseBones = "$collapsebones",
    CollapseBonesAggressive = "$collapsebonesaggressive",
    AlwaysCollapse = "$alwayscollapse",
    ProceduralBones = "$proceduralbones",
    SkipTransition = "$skiptransition",
    CalcTransitions = "$calctransitions",
    StaticProp = "$staticprop",
    ZBrush = "$zbrush",
    RealignBones = "$realignbones",
    ForceRealign = "$forcerealign",
    Lod = "$lod",
    ShadowLod = "$shadowlod",
    PoseParameter = "$poseparameter",
    Heirarchy = "$heirarchy",
    Hierarchy = "$hierarchy",
    InsertBone = "$insertbone",
    LimitRotation = "$limitrotation",
    DefineBone = "$definebone",
    JiggleBone = "$jigglebone",
    Includemodel = "$includemodel",
    Opaque = "$opaque",
    MostlyOpaque = "$mostlyopaque",
    KeyValues = "$keyvalues",
    Obsolete = "$obsolete",
    RenameMaterial = "$renamematerial",
    RenameMaterialSubstr = "$renamematerialsubstr",
    OverrideMaterial = "$overridematerial",
    StripMaterialPaths = "$stripmaterialpaths",
    FakeVta = "$fakevta",
    NoForcedFade = "$noforcedfade",
    SkipBoneInBBox = "$skipboneinbbox",
    ForcePhonemeCrossfade = "$forcephonemecrossfade",
    LockBoneLengths = "$lockbonelengths",
    UnlockDefineBones = "$unlockdefinebones",
    ConstantDirectionalLight = "$constantdirectionallight",
    MinLod = "$minlod",
    AllowRootLods = "$allowrootlods",
    BoneSaveFrame = "$bonesaveframe",
    AmbientBoost = "$ambientboost",
    CenterBonesOnVerts = "$centerbonesonverts",
    DoNotCastShadows = "$donotcastshadows",
    CastTextureShadows = "$casttextureshadows",
    MotionRollback = "$motionrollback",
    SectionFrames = "$sectionframes",
    ClampWorldSpace = "$clampworldspace",
    MaxEyeDeflection = "$maxeyedeflection",
    AddSearchDir = "$addsearchdir",
    PhyName = "$phyname",
    SubD = "$subd",
    BoneFlexDriver = "$boneflexdriver",
    MaxVerts = "$maxverts",
    PreserveTriangleOrder = "$preservetriangleorder",
    QcAssert = "$qcassert",
    LCaseAllSequences = "$lcaseallsequences",
    DefaultFadein = "$defaultfadein",
    DefaultFadeOut = "$defaultfadeout",
    Cloth = "$cloth",
    ClothPlaneCollision = "$clothplanecollision",
    AllowActivityName = "$allowactivityname",
    CollisionPrecision = "$collisionprecision",
    ErrorOnSequenceRemappingFailure = "$erroronsequenceremappingfailure",
    ErrorOnSequenceRemappingFailureDisable = "$erroronsequenceremappingfailure_disable",
    ModelHasNoSequences = "$modelhasnosequences",
    ContentRootRelative = "$contentrootrelative",
    AddUvMapChannelTo = "$adduvmapchannelto",
    Section = "$section",
    SectionEnable = "$sectionenable",
    SectionDisable = "$sectiondisable",
}

export interface QcCommandContent {
    command: QcCommand;
    content: string;
}

export interface QcDocument {
    commands: QcCommandContent[];
}

export const QcTokenizer = {
    tokenizeText(text: string): QcToken[] {
        const tokenList: QcToken[] = [];

        let line = 0;
        let lineColumn = -1;
        for (let i = 0; i < text.length; i++) {
            const c = text.charAt(i);
            const a = text.charCodeAt(i);
            const n = text.length - 1 > i ? text.charAt(i + 1) : undefined;
            lineColumn++;

            // CR and LF are < 32 in ascii so handle these before the next if
            if (c === "\r" || c === "\n") {
                if (c === "\n") {
                    line++;
                    lineColumn = -1;
                }
                continue;
            }

            // Ascii codes below 32 are control chars (including tab).
            // 32 is space. Skip forward on these
            if (a <= 32) continue;

            if (c === "/" && n === "/") {
                const commentLength = consumeComment(text, i + 2);
                tokenList.push({
                    line,
                    type: QcTokenTypes.Comment,
                    range: { start: lineColumn, end: lineColumn + commentLength },
                    value: text.substring(i, i + commentLength),
                });
                i += commentLength - 1;
                lineColumn += commentLength - 1;
                continue;
            }

            if (c === "#" || c === ";") {
                const commentLength = consumeComment(text, i + 1);
                tokenList.push({
                    line,
                    type: QcTokenTypes.Comment,
                    range: { start: lineColumn, end: lineColumn + commentLength - 1 },
                    value: text.substring(i, i + commentLength - 1),
                });
                i += commentLength - 2;
                lineColumn += commentLength - 2;
                continue;
            }

            // Is it a scope?
            if (c === "{") {
                tokenList.push({
                    line,
                    type: QcTokenTypes.ScopeStart,
                    range: { start: lineColumn, end: lineColumn + 1 },
                    value: c,
                });
                continue;
            }
            if (c === "}") {
                tokenList.push({
                    line,
                    type: QcTokenTypes.ScopeEnd,
                    range: { start: lineColumn, end: lineColumn + 1 },
                    value: c,
                });
                continue;
            }

            // if it's not a scope, count it as a string literal or command
            const stringLength = consumeString(text, i);
            const stringContent = text.substring(i, i + stringLength);

            const isCommand = stringContent.startsWith("$");

            tokenList.push({
                line,
                type: isCommand ? QcTokenTypes.Command : QcTokenTypes.Literal,
                range: { start: lineColumn, end: lineColumn + stringLength },
                value: stringContent,
            });

            i += stringLength - 1; // Prevents skipping the next character after the string
            lineColumn += stringLength - 1;
        }

        return tokenList;
    },
};

export const QcTokenTypes = {
    Comment: 0,
    Command: 1,
    Literal: 2,
    ScopeStart: 3,
    ScopeEnd: 4,
} as const;
export type QcTokenType = (typeof QcTokenTypes)[keyof typeof QcTokenTypes];

interface QcRange {
    start: number;
    end: number;
}

export interface QcToken {
    line: number;
    range: QcRange;
    type: QcTokenType;
    value: string;
}
