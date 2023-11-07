import { useContext, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { TNodeTreeData, TNodeUid } from "@_node/types";
import { osTypeSelector } from "@_redux/global";
import { MainContext } from "@_redux/main";
import {
  currentFileUidSelector,
  fileTreeSelector,
  projectSelector,
  setCurrentFileUid,
  setFileTree,
  updateFileTreeViewState,
} from "@_redux/main/fileTree";
import { setNodeTree, setValidNodeTree } from "@_redux/main/nodeTree";
import { setIframeSrc } from "@_redux/main/stageView";

import {
  loadIDBProject,
  loadLocalProject,
  processHandlerObj,
} from "../helpers";
import { TFileNodeTreeData } from "@_node/index";

export const useReloadProject = () => {
  const project = useSelector(projectSelector);
  const fileTree = useSelector(fileTreeSelector);
  const currentFileUid = useSelector(currentFileUidSelector);
  const osType = useSelector(osTypeSelector);

  const { fileHandlers, setFileHandlers } = useContext(MainContext);

  const ffTreeRef = useRef<TNodeTreeData>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  async function reloadProject(_uid?: TNodeUid) {
    setIsLoading(true);
    let handlerObj = {};
    let _deletedUids: TNodeUid[] = [];

    if (project.context === "local") {
      const result = await loadLocalProject(fileTree, fileHandlers, osType);
      handlerObj = result.handlerObj;
      _deletedUids = result.deletedUids;
    } else if (project.context === "idb") {
      const result = await loadIDBProject(fileTree);
      handlerObj = result.handlerObj;
      _deletedUids = result.deletedUids;
    }

    const { treeViewData, ffHandlerObj } = processHandlerObj(
      handlerObj,
      fileTree,
    );

    dispatch(updateFileTreeViewState({ deletedUids: _deletedUids }));
    if (_uid && !treeViewData[_uid]) {
      dispatch(setIframeSrc(null));
      dispatch(setNodeTree({}));
      dispatch(setValidNodeTree({}));
      dispatch(setCurrentFileUid(""));
    }
    ffTreeRef.current = treeViewData;

    dispatch(setFileTree(treeViewData as TFileNodeTreeData));
    setFileHandlers(ffHandlerObj);

    setIsLoading(false);
  }

  /* useEffect(() => {
    if (project.context === "local" || project.context === "idb") {
      console.log("useReloadProject CALL");
      reloadProject();
    }
  }, [project.context]); */

  return { cb_reloadProject: reloadProject };
};
