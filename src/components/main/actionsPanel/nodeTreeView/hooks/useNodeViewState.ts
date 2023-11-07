import { useCallback, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getValidNodeUids } from "@_node/apis";
import { TFileNodeData } from "@_node/file";
import { TNodeUid } from "@_node/types";
import { MainContext } from "@_redux/main";
import {
  fileTreeSelector,
  selectFileTreeNodes,
  setCurrentFileUid,
} from "@_redux/main/fileTree";
import {
  collapseNodeTreeNodes,
  expandNodeTreeNodes,
  focusNodeTreeNode,
  nodeTreeViewStateSelector,
  selectNodeTreeNodes,
  validNodeTreeSelector,
} from "@_redux/main/nodeTree";
import { NodeTree_Event_ClearActionType } from "@_redux/main/nodeTree/event";
import { setNavigatorDropdownType } from "@_redux/main/processor";

export function useNodeViewState(focusItemValue: TNodeUid | null) {
  const dispatch = useDispatch();

  const fileTree = useSelector(fileTreeSelector);
  const validNodeTree = useSelector(validNodeTreeSelector);
  const { addRunningActions, removeRunningActions } = useContext(MainContext);

  const { focusedItem, selectedItems, selectedItemsObj } = useSelector(
    nodeTreeViewStateSelector,
  );
  const {
    // toasts
    parseFileFlag,
    setParseFile,
    prevFileUid,
  } = useContext(MainContext);

  const cb_focusNode = useCallback(
    (uid: TNodeUid) => {
      addRunningActions(["nodeTreeView-focus"]);

      // validate
      if (focusedItem === uid) {
        removeRunningActions(["nodeTreeView-focus"], false);
        return;
      }

      dispatch(focusNodeTreeNode(uid));
      focusItemValue = uid;

      removeRunningActions(["nodeTreeView-focus"]);
    },
    [addRunningActions, removeRunningActions, focusedItem],
  );

  const cb_selectNode = useCallback(
    (uids: TNodeUid[]) => {
      addRunningActions(["nodeTreeView-select"]);

      // validate
      const _uids = getValidNodeUids(validNodeTree, uids);
      if (_uids.length === selectedItems.length) {
        let same = true;
        for (const _uid of _uids) {
          if (selectedItemsObj[_uid] === undefined) {
            same = false;
            break;
          }
        }
        if (same) {
          removeRunningActions(["nodeTreeView-select"], false);
          return;
        }
      }

      dispatch(selectNodeTreeNodes(_uids));

      if (!parseFileFlag) {
        const node = fileTree[prevFileUid];
        const uid = prevFileUid;
        const nodeData = node.data as TFileNodeData;
        setParseFile(true);
        dispatch(setNavigatorDropdownType("project"));
        dispatch({ type: NodeTree_Event_ClearActionType });
        dispatch(setCurrentFileUid(uid));
        dispatch(selectFileTreeNodes([prevFileUid]));
      }
      removeRunningActions(["nodeTreeView-select"]);
    },
    [
      addRunningActions,
      removeRunningActions,
      validNodeTree,
      selectedItems,
      selectedItemsObj,
      parseFileFlag,
    ],
  );

  const cb_expandNode = useCallback(
    (uid: TNodeUid) => {
      addRunningActions(["nodeTreeView-arrow"]);

      dispatch(expandNodeTreeNodes([uid]));

      removeRunningActions(["nodeTreeView-arrow"]);
    },
    [addRunningActions, removeRunningActions],
  );

  const cb_collapseNode = useCallback(
    (uid: TNodeUid) => {
      addRunningActions(["nodeTreeView-arrow"]);

      dispatch(collapseNodeTreeNodes([uid]));

      removeRunningActions(["nodeTreeView-arrow"]);
    },
    [addRunningActions, removeRunningActions],
  );

  return { cb_focusNode, cb_selectNode, cb_expandNode, cb_collapseNode };
}
