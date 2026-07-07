import { Document, Item, KvParser, Literal } from "./KvParser.js";
import { KvStringUtil } from "./KvStringUtil.js";

type KvNodeValue = string | number | boolean;
type KvNodeRecord = { [key: string]: KvNodeValue | KvNodeValue[] | KvNode };
type KvNodeArray = (KvNode | KvNodeValue)[];
type KvNode = KvNodeRecord | KvNodeArray;

export interface KvSerializeOptions {
    name?: string;
    indentSpaces?: number;
    indentTabs?: boolean;
}

export interface KvDeserializeOptions {
    detectArrays?: boolean;
}

export const KvSerializer = {
    serialize(obj: Record<string, unknown>, options?: KvSerializeOptions, nestedLevel = 0): string {
        let indentObjStr = "";
        let indentChar = "";
        if (options?.indentTabs) {
            indentChar = "\t";
        } else {
            for (let i = 0; i < (options?.indentSpaces ?? 2); i++) {
                indentChar += " ";
            }
        }
        for (let i = 0; i < nestedLevel; i++) {
            indentObjStr += indentChar;
        }
        const indentStrKv = indentObjStr + indentChar;

        const kvObjHead = `${indentObjStr}"${options?.name ?? "Object"}" {`;
        const kvLines: string[] = [kvObjHead];
        for (const [key, val] of Object.entries(obj)) {
            const valIsObj = typeof val === "object";
            const objHasCustomToString =
                typeof val?.toString === "function" && val.toString !== Object.prototype.toString;
            const doSerializeObj = valIsObj && !objHasCustomToString;

            if (doSerializeObj) {
                const serialized = KvSerializer.serialize(
                    val as Record<string, unknown>,
                    { ...options, name: key },
                    nestedLevel + 1,
                );
                kvLines.push(serialized);
            } else {
                const kvString = `${indentStrKv}"${key}" "${String(val)}"`;
                kvLines.push(kvString);
            }
        }
        kvLines.push(`${indentObjStr}}`);

        const fullStr = kvLines.join("\n");
        return fullStr;
    },

    deserializeText(text: string, options?: KvDeserializeOptions): KvNode[] {
        return KvSerializer.deserialize(KvParser.parseText(text), options);
    },

    deserialize(doc: Document, options?: KvDeserializeOptions): KvNode[] {
        const nodes = doc
            .getRootItems()
            .map(_deserializeItem)
            .filter((i) => i !== undefined) as KvNode[];
        if (options?.detectArrays) {
            return _recursiveTransformNodesToArray(nodes);
        }
        return nodes;
    },
};

function _deserializeItem(item: Item): KvNode | undefined {
    const children = item.getChildren();
    if (!children) {
        return;
    }

    const node: KvNode = {};
    for (const child of children) {
        const values = child.getValues();
        const hasChildren = child.getChildren() !== null;
        const name = child.getKey().getUnquotedContent();

        if (values) {
            const val = _deserializeItemValue(values);
            if (val !== undefined) {
                node[name] = val;
            }
        } else if (hasChildren) {
            const childName = child.getKey().getUnquotedContent();
            const childItem = _deserializeItem(child);
            if (childItem) {
                node[childName] = childItem;
            }
        }
    }

    return node;
}

function _deserializeItemValue(vals: Literal[]): KvNodeValue | KvNodeValue[] | undefined {
    if (vals.length === 1) {
        return _transformKvValue(vals[0].getUnquotedContent());
    } else {
        return vals.map((v) => _transformKvValue(v.getUnquotedContent()));
    }
}

function _recursiveTransformNodesToArray(nodes: KvNode[]): KvNode[] {
    const result: KvNode[] = [];
    for (const node of nodes) {
        result.push(_transformNodeToArray(node));
    }
    return result;
}

function _transformNodeToArray(node: KvNode): KvNode {
    if (typeof node !== "object") {
        return node;
    }

    const resultNode: KvNodeRecord = {};
    const entries = Object.entries(node);
    for (const [k, v] of entries) {
        if (typeof v === "object") {
            const newV = _transformNodeToArray(v);
            if (_isArrayNode(newV)) {
                resultNode[k] = Array.from(Object.values(newV));
            } else {
                resultNode[k] = v;
            }
        } else {
            resultNode[k] = v;
        }
    }

    return resultNode;
}

function _isArrayNode(node: KvNode): boolean {
    let prev = -1;
    for (const key of Object.keys(node)) {
        const intKey = Number.parseInt(key);
        if (Number.isNaN(intKey)) {
            return false;
        }

        if (intKey !== prev + 1) {
            return false;
        }

        prev += 1;
    }

    return true;
}

function _transformKvValue(val: string): KvNodeValue {
    if (KvStringUtil.isFloatValue(val)) {
        const float = Number.parseFloat(val);
        if (!Number.isNaN(float)) {
            return float;
        }
    } else if (KvStringUtil.isIntegerValue(val)) {
        const int = Number.parseInt(val);
        if (!Number.isNaN(int)) {
            return int;
        }
    }

    if (val === "true") {
        return true;
    }
    if (val === "false") {
        return false;
    }

    return val;
}
