/* import { THtmlReferenceData } from '@_node/html';
import { THtmlNodeData } from '@_node/index';
import {
  TNode,
  TNodeTreeData,
  TNodeUid,
} from '@_node/types';

export const creatingNode = (
  nodeMaxUid: number,
  nodeTree: TNodeTreeData,
  focusedItem: TNodeUid,
  nodeType: string,
  htmlReferenceData: THtmlReferenceData,
) => {
  const newNode: TNode = {
    uid: String(nodeMaxUid + 1) as TNodeUid,
    parentUid: nodeTree[focusedItem].parentUid as TNodeUid,
    displayName: nodeType,
    isEntity: true,
    children: [],
    data: {
      valid: true,

      type: "tag",
      name: nodeType,
      data: "",
      attribs: { [StageNodeIdAttr]: String(nodeMaxUid + 1) as TNodeUid },

      html: "",
      htmlInApp: "",
    } as THtmlNodeData,
    sourceCodeLocation: {
      startCol: 0,
      endCol: 0,
      endLine: 0,
      startLine: 0,
      endOffset: 0,
      startOffset: 0,
    },
  };

  let contentNode: TNode | null = null;
  let _tree: TNodeTreeData | null = null;
  let tmpMaxUid: TNodeUid = String(nodeMaxUid);
  let newNodeFlag = false;

  const refData = htmlReferenceData.elements[nodeType];

  if (refData) {
    const { Attributes, Content } = refData;
    if (Attributes) {
      const newNodeData = newNode.data as THtmlNodeData;
      let temp = "";
      Attributes.split(" ").map((attr: any) => {
        temp = temp + " " + attr;
        if (attr === "controls") {
          newNodeData.attribs["controls"] = "";
        }
        if (
          (temp.match(/”/g) || [])?.length > 1 ||
          (temp.match(/"/g) || [])?.length > 1
        ) {
          const parseAttr = temp.split("=");
          newNodeData.attribs[parseAttr[0].trim()] = parseAttr[1]
            .replace("”", "")
            .replace("”", "")
            .replace('"', "")
            .replace('"', "");
          temp = "";
        }
      });
    }

    if (Content) {
      newNodeFlag = true;
      let parserRes = parseHtmlCodePart(
        Content,
        String(nodeMaxUid) as TNodeUid,
        0,
      );

      const { tree, nodeMaxUid: newNodeMaxUid } = parserRes;
      tmpMaxUid = newNodeMaxUid;
      _tree = tree;
      newNode.isEntity = false;

      // @ts-ignore
      newNode.children = [String(nodeMaxUid + 2) as TNodeUid];
      contentNode = {
        uid: String(nodeMaxUid + 2) as TNodeUid,
        parentUid: String(nodeMaxUid + 1) as TNodeUid,
        name: "text",
        isEntity: true,
        children: [],
        data: {
          valid: false,
          isFormatText: false,

          type: "text",
          name: "text",
          data: Content,
          attribs: { [StageNodeIdAttr]: tmpMaxUid as TNodeUid },

          html: "",
          htmlInApp: "",
        } as THtmlNodeData,
        sourceCodeLocation: {
          startCol: 0,
          endCol: 0,
          endLine: 0,
          startLine: 0,
          endOffset: 0,
          startOffset: 0,
        },
      } as TNode;
    }
  }

  return { newNode, _tree, tmpMaxUid, contentNode, newNodeFlag };
};
 */
