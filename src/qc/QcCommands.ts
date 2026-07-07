import { QcToken } from "./QcTokenizer";
import { parseSequence, QcCommandContext_Sequence } from "./commands/QcCmd_Sequence";
import { parseBody, QcCommandContext_Body } from "./commands/QcCmd_Body";
import { parseCollisionModel, QcCommandContext_CollisionModel } from "./commands/QcCmd_CollisionModel";

export type QcCommandContext = object;

export interface QcCommandContent<T extends QcCommand = QcCommand> {
    command: T;
    commandToken: QcToken;
    contentTokens: QcToken[];
    content: QcCommandToContextMap[T] | undefined;
}

export interface QcDocument {
    commands: QcCommandContent[];
}

export function getQcCommandContent<T extends QcCommand = QcCommand>(
    content: QcCommandContent<T>,
): QcCommandToContextMap[T] {
    return content.content as QcCommandToContextMap[T];
}

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

export type QcCommandToContextMap = {
    [QcCommand.Cd]: QcCommandContext;
    [QcCommand.ModelName]: QcCommandContext;
    [QcCommand.InternalName]: QcCommandContext;
    [QcCommand.CdMaterials]: QcCommandContext;
    [QcCommand.PushD]: QcCommandContext;
    [QcCommand.PopD]: QcCommandContext;
    [QcCommand.Scale]: QcCommandContext;
    [QcCommand.Root]: QcCommandContext;
    [QcCommand.Controller]: QcCommandContext;
    [QcCommand.ScreenAlign]: QcCommandContext;
    [QcCommand.WorldAlign]: QcCommandContext;
    [QcCommand.KeepUpright]: QcCommandContext;
    [QcCommand.Model]: QcCommandContext;
    [QcCommand.CollisionModel]: QcCommandContext_CollisionModel;
    [QcCommand.CollisionJoints]: QcCommandContext_CollisionModel;
    [QcCommand.CollisionText]: QcCommandContext;
    [QcCommand.AppendSource]: QcCommandContext;
    [QcCommand.Body]: QcCommandContext_Body;
    [QcCommand.PreferFbx]: QcCommandContext;
    [QcCommand.BodyGroup]: QcCommandContext;
    [QcCommand.AppendBlankBodyGroup]: QcCommandContext;
    [QcCommand.BodyGroupReset]: QcCommandContext;
    [QcCommand.Animation]: QcCommandContext;
    [QcCommand.AutoCenter]: QcCommandContext;
    [QcCommand.Sequence]: QcCommandContext_Sequence;
    [QcCommand.Append]: QcCommandContext;
    [QcCommand.Prepend]: QcCommandContext;
    [QcCommand.Continue]: QcCommandContext;
    [QcCommand.DeclareSequence]: QcCommandContext;
    [QcCommand.DeclareAnimation]: QcCommandContext;
    [QcCommand.CmdList]: QcCommandContext;
    [QcCommand.AnimBlockSize]: QcCommandContext;
    [QcCommand.WeightList]: QcCommandContext;
    [QcCommand.DefaultWeightList]: QcCommandContext;
    [QcCommand.IkChain]: QcCommandContext;
    [QcCommand.IkAutoPlayLock]: QcCommandContext;
    [QcCommand.EyePosition]: QcCommandContext;
    [QcCommand.IllumPosition]: QcCommandContext;
    [QcCommand.Origin]: QcCommandContext;
    [QcCommand.OriginBones]: QcCommandContext;
    [QcCommand.UpAxis]: QcCommandContext;
    [QcCommand.BBox]: QcCommandContext;
    [QcCommand.BBoxOnlyVerts]: QcCommandContext;
    [QcCommand.CBox]: QcCommandContext;
    [QcCommand.Gamma]: QcCommandContext;
    [QcCommand.TextureGroup]: QcCommandContext;
    [QcCommand.HGroup]: QcCommandContext;
    [QcCommand.HBox]: QcCommandContext;
    [QcCommand.HBoxSet]: QcCommandContext;
    [QcCommand.SurfaceProp]: QcCommandContext;
    [QcCommand.JointSurfaceProp]: QcCommandContext;
    [QcCommand.Contents]: QcCommandContext;
    [QcCommand.JointContents]: QcCommandContext;
    [QcCommand.Attachment]: QcCommandContext;
    [QcCommand.RedefineAttachment]: QcCommandContext;
    [QcCommand.BoneMerge]: QcCommandContext;
    [QcCommand.BoneAlwaysSetup]: QcCommandContext;
    [QcCommand.ExternalTextures]: QcCommandContext;
    [QcCommand.ClipToTextures]: QcCommandContext;
    [QcCommand.SkinnedLods]: QcCommandContext;
    [QcCommand.RenameBone]: QcCommandContext;
    [QcCommand.StripBonePrefix]: QcCommandContext;
    [QcCommand.RenameBoneSubstr]: QcCommandContext;
    [QcCommand.CollapseBones]: QcCommandContext;
    [QcCommand.CollapseBonesAggressive]: QcCommandContext;
    [QcCommand.AlwaysCollapse]: QcCommandContext;
    [QcCommand.ProceduralBones]: QcCommandContext;
    [QcCommand.SkipTransition]: QcCommandContext;
    [QcCommand.CalcTransitions]: QcCommandContext;
    [QcCommand.StaticProp]: QcCommandContext;
    [QcCommand.ZBrush]: QcCommandContext;
    [QcCommand.RealignBones]: QcCommandContext;
    [QcCommand.ForceRealign]: QcCommandContext;
    [QcCommand.Lod]: QcCommandContext;
    [QcCommand.ShadowLod]: QcCommandContext;
    [QcCommand.PoseParameter]: QcCommandContext;
    [QcCommand.Heirarchy]: QcCommandContext;
    [QcCommand.Hierarchy]: QcCommandContext;
    [QcCommand.InsertBone]: QcCommandContext;
    [QcCommand.LimitRotation]: QcCommandContext;
    [QcCommand.DefineBone]: QcCommandContext;
    [QcCommand.JiggleBone]: QcCommandContext;
    [QcCommand.Includemodel]: QcCommandContext;
    [QcCommand.Opaque]: QcCommandContext;
    [QcCommand.MostlyOpaque]: QcCommandContext;
    [QcCommand.KeyValues]: QcCommandContext;
    [QcCommand.Obsolete]: QcCommandContext;
    [QcCommand.RenameMaterial]: QcCommandContext;
    [QcCommand.RenameMaterialSubstr]: QcCommandContext;
    [QcCommand.OverrideMaterial]: QcCommandContext;
    [QcCommand.StripMaterialPaths]: QcCommandContext;
    [QcCommand.FakeVta]: QcCommandContext;
    [QcCommand.NoForcedFade]: QcCommandContext;
    [QcCommand.SkipBoneInBBox]: QcCommandContext;
    [QcCommand.ForcePhonemeCrossfade]: QcCommandContext;
    [QcCommand.LockBoneLengths]: QcCommandContext;
    [QcCommand.UnlockDefineBones]: QcCommandContext;
    [QcCommand.ConstantDirectionalLight]: QcCommandContext;
    [QcCommand.MinLod]: QcCommandContext;
    [QcCommand.AllowRootLods]: QcCommandContext;
    [QcCommand.BoneSaveFrame]: QcCommandContext;
    [QcCommand.AmbientBoost]: QcCommandContext;
    [QcCommand.CenterBonesOnVerts]: QcCommandContext;
    [QcCommand.DoNotCastShadows]: QcCommandContext;
    [QcCommand.CastTextureShadows]: QcCommandContext;
    [QcCommand.MotionRollback]: QcCommandContext;
    [QcCommand.SectionFrames]: QcCommandContext;
    [QcCommand.ClampWorldSpace]: QcCommandContext;
    [QcCommand.MaxEyeDeflection]: QcCommandContext;
    [QcCommand.AddSearchDir]: QcCommandContext;
    [QcCommand.PhyName]: QcCommandContext;
    [QcCommand.SubD]: QcCommandContext;
    [QcCommand.BoneFlexDriver]: QcCommandContext;
    [QcCommand.MaxVerts]: QcCommandContext;
    [QcCommand.PreserveTriangleOrder]: QcCommandContext;
    [QcCommand.QcAssert]: QcCommandContext;
    [QcCommand.LCaseAllSequences]: QcCommandContext;
    [QcCommand.DefaultFadein]: QcCommandContext;
    [QcCommand.DefaultFadeOut]: QcCommandContext;
    [QcCommand.Cloth]: QcCommandContext;
    [QcCommand.ClothPlaneCollision]: QcCommandContext;
    [QcCommand.AllowActivityName]: QcCommandContext;
    [QcCommand.CollisionPrecision]: QcCommandContext;
    [QcCommand.ErrorOnSequenceRemappingFailure]: QcCommandContext;
    [QcCommand.ErrorOnSequenceRemappingFailureDisable]: QcCommandContext;
    [QcCommand.ModelHasNoSequences]: QcCommandContext;
    [QcCommand.ContentRootRelative]: QcCommandContext;
    [QcCommand.AddUvMapChannelTo]: QcCommandContext;
    [QcCommand.Section]: QcCommandContext;
    [QcCommand.SectionEnable]: QcCommandContext;
    [QcCommand.SectionDisable]: QcCommandContext;
};

export type QcCommandParseFunc = (tokens: QcToken[]) => QcCommandContext | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nothingFunc = (tokens: QcToken[]) => undefined;
export const QcCommandToParseFunctionMap: Record<QcCommand, QcCommandParseFunc> = {
    [QcCommand.Cd]: nothingFunc,
    [QcCommand.ModelName]: nothingFunc,
    [QcCommand.InternalName]: nothingFunc,
    [QcCommand.CdMaterials]: nothingFunc,
    [QcCommand.PushD]: nothingFunc,
    [QcCommand.PopD]: nothingFunc,
    [QcCommand.Scale]: nothingFunc,
    [QcCommand.Root]: nothingFunc,
    [QcCommand.Controller]: nothingFunc,
    [QcCommand.ScreenAlign]: nothingFunc,
    [QcCommand.WorldAlign]: nothingFunc,
    [QcCommand.KeepUpright]: nothingFunc,
    [QcCommand.Model]: nothingFunc,
    [QcCommand.CollisionModel]: parseCollisionModel,
    [QcCommand.CollisionJoints]: parseCollisionModel,
    [QcCommand.CollisionText]: nothingFunc,
    [QcCommand.AppendSource]: nothingFunc,
    [QcCommand.Body]: parseBody,
    [QcCommand.PreferFbx]: nothingFunc,
    [QcCommand.BodyGroup]: nothingFunc,
    [QcCommand.AppendBlankBodyGroup]: nothingFunc,
    [QcCommand.BodyGroupReset]: nothingFunc,
    [QcCommand.Animation]: nothingFunc,
    [QcCommand.AutoCenter]: nothingFunc,
    [QcCommand.Sequence]: parseSequence,
    [QcCommand.Append]: nothingFunc,
    [QcCommand.Prepend]: nothingFunc,
    [QcCommand.Continue]: nothingFunc,
    [QcCommand.DeclareSequence]: nothingFunc,
    [QcCommand.DeclareAnimation]: nothingFunc,
    [QcCommand.CmdList]: nothingFunc,
    [QcCommand.AnimBlockSize]: nothingFunc,
    [QcCommand.WeightList]: nothingFunc,
    [QcCommand.DefaultWeightList]: nothingFunc,
    [QcCommand.IkChain]: nothingFunc,
    [QcCommand.IkAutoPlayLock]: nothingFunc,
    [QcCommand.EyePosition]: nothingFunc,
    [QcCommand.IllumPosition]: nothingFunc,
    [QcCommand.Origin]: nothingFunc,
    [QcCommand.OriginBones]: nothingFunc,
    [QcCommand.UpAxis]: nothingFunc,
    [QcCommand.BBox]: nothingFunc,
    [QcCommand.BBoxOnlyVerts]: nothingFunc,
    [QcCommand.CBox]: nothingFunc,
    [QcCommand.Gamma]: nothingFunc,
    [QcCommand.TextureGroup]: nothingFunc,
    [QcCommand.HGroup]: nothingFunc,
    [QcCommand.HBox]: nothingFunc,
    [QcCommand.HBoxSet]: nothingFunc,
    [QcCommand.SurfaceProp]: nothingFunc,
    [QcCommand.JointSurfaceProp]: nothingFunc,
    [QcCommand.Contents]: nothingFunc,
    [QcCommand.JointContents]: nothingFunc,
    [QcCommand.Attachment]: nothingFunc,
    [QcCommand.RedefineAttachment]: nothingFunc,
    [QcCommand.BoneMerge]: nothingFunc,
    [QcCommand.BoneAlwaysSetup]: nothingFunc,
    [QcCommand.ExternalTextures]: nothingFunc,
    [QcCommand.ClipToTextures]: nothingFunc,
    [QcCommand.SkinnedLods]: nothingFunc,
    [QcCommand.RenameBone]: nothingFunc,
    [QcCommand.StripBonePrefix]: nothingFunc,
    [QcCommand.RenameBoneSubstr]: nothingFunc,
    [QcCommand.CollapseBones]: nothingFunc,
    [QcCommand.CollapseBonesAggressive]: nothingFunc,
    [QcCommand.AlwaysCollapse]: nothingFunc,
    [QcCommand.ProceduralBones]: nothingFunc,
    [QcCommand.SkipTransition]: nothingFunc,
    [QcCommand.CalcTransitions]: nothingFunc,
    [QcCommand.StaticProp]: nothingFunc,
    [QcCommand.ZBrush]: nothingFunc,
    [QcCommand.RealignBones]: nothingFunc,
    [QcCommand.ForceRealign]: nothingFunc,
    [QcCommand.Lod]: nothingFunc,
    [QcCommand.ShadowLod]: nothingFunc,
    [QcCommand.PoseParameter]: nothingFunc,
    [QcCommand.Heirarchy]: nothingFunc,
    [QcCommand.Hierarchy]: nothingFunc,
    [QcCommand.InsertBone]: nothingFunc,
    [QcCommand.LimitRotation]: nothingFunc,
    [QcCommand.DefineBone]: nothingFunc,
    [QcCommand.JiggleBone]: nothingFunc,
    [QcCommand.Includemodel]: nothingFunc,
    [QcCommand.Opaque]: nothingFunc,
    [QcCommand.MostlyOpaque]: nothingFunc,
    [QcCommand.KeyValues]: nothingFunc,
    [QcCommand.Obsolete]: nothingFunc,
    [QcCommand.RenameMaterial]: nothingFunc,
    [QcCommand.RenameMaterialSubstr]: nothingFunc,
    [QcCommand.OverrideMaterial]: nothingFunc,
    [QcCommand.StripMaterialPaths]: nothingFunc,
    [QcCommand.FakeVta]: nothingFunc,
    [QcCommand.NoForcedFade]: nothingFunc,
    [QcCommand.SkipBoneInBBox]: nothingFunc,
    [QcCommand.ForcePhonemeCrossfade]: nothingFunc,
    [QcCommand.LockBoneLengths]: nothingFunc,
    [QcCommand.UnlockDefineBones]: nothingFunc,
    [QcCommand.ConstantDirectionalLight]: nothingFunc,
    [QcCommand.MinLod]: nothingFunc,
    [QcCommand.AllowRootLods]: nothingFunc,
    [QcCommand.BoneSaveFrame]: nothingFunc,
    [QcCommand.AmbientBoost]: nothingFunc,
    [QcCommand.CenterBonesOnVerts]: nothingFunc,
    [QcCommand.DoNotCastShadows]: nothingFunc,
    [QcCommand.CastTextureShadows]: nothingFunc,
    [QcCommand.MotionRollback]: nothingFunc,
    [QcCommand.SectionFrames]: nothingFunc,
    [QcCommand.ClampWorldSpace]: nothingFunc,
    [QcCommand.MaxEyeDeflection]: nothingFunc,
    [QcCommand.AddSearchDir]: nothingFunc,
    [QcCommand.PhyName]: nothingFunc,
    [QcCommand.SubD]: nothingFunc,
    [QcCommand.BoneFlexDriver]: nothingFunc,
    [QcCommand.MaxVerts]: nothingFunc,
    [QcCommand.PreserveTriangleOrder]: nothingFunc,
    [QcCommand.QcAssert]: nothingFunc,
    [QcCommand.LCaseAllSequences]: nothingFunc,
    [QcCommand.DefaultFadein]: nothingFunc,
    [QcCommand.DefaultFadeOut]: nothingFunc,
    [QcCommand.Cloth]: nothingFunc,
    [QcCommand.ClothPlaneCollision]: nothingFunc,
    [QcCommand.AllowActivityName]: nothingFunc,
    [QcCommand.CollisionPrecision]: nothingFunc,
    [QcCommand.ErrorOnSequenceRemappingFailure]: nothingFunc,
    [QcCommand.ErrorOnSequenceRemappingFailureDisable]: nothingFunc,
    [QcCommand.ModelHasNoSequences]: nothingFunc,
    [QcCommand.ContentRootRelative]: nothingFunc,
    [QcCommand.AddUvMapChannelTo]: nothingFunc,
    [QcCommand.Section]: nothingFunc,
    [QcCommand.SectionEnable]: nothingFunc,
    [QcCommand.SectionDisable]: nothingFunc,
};
