import React, { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import EditableNode from "./EditableNode";
import { Zap, Save, Download, Upload } from "lucide-react";

const nodeTypes = { editableNode: EditableNode };

const defaultEdgeOptions = {
  type: "smoothstep",
  style: {
    stroke: "#3b82f6",
    strokeWidth: 2,
  },
  markerEnd: {
    type: "arrowclosed",
    color: "#3b82f6",
  },
};

const MapEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "root-node",
      type: "editableNode",
      position: { x: 0, y: 0 },
      data: {
        label: "My Mind Map",
        style: "default",
      },
    },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [copiedNode, setCopiedNode] = useState(null);

  const nodesRef = useRef(nodes);
  const reactFlowWrapper = useRef(null);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            ...defaultEdgeOptions,
            id: `edge-${Date.now()}`,
          },
          eds
        )
      );
      setIsConnecting(false);
      setConnectingFrom(null);
    },
    [setEdges]
  );

  const addNode = useCallback(
    (parentId, position) => {
      const newNodeId = `node-${Date.now()}`;
      const parentNode = nodesRef.current.find((n) => n.id === parentId);

      if (!parentNode) return;

      const childCount = nodesRef.current.filter((node) =>
        edges.some(
          (edge) => edge.source === parentId && edge.target === node.id
        )
      ).length;

      const newPosition = position || {
        x: parentNode.position.x + (childCount % 2 === 0 ? 250 : -250),
        y: parentNode.position.y + 200 + Math.floor(childCount / 2) * 150,
      };

      setNodes((nds) => [
        ...nds,
        {
          id: newNodeId,
          type: "editableNode",
          position: newPosition,
          data: {
            label: "New Node",
            style: "default",
          },
        },
      ]);

      setEdges((eds) =>
        addEdge(
          {
            id: `edge-${Date.now()}`,
            source: parentId,
            target: newNodeId,
            ...defaultEdgeOptions,
          },
          eds
        )
      );

      // Auto-select the new node
      setTimeout(() => setSelectedNodeId(newNodeId), 100);
    },
    [edges, setNodes, setEdges]
  );

  const updateNodeData = useCallback(
    (id, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const handleToolbarAction = useCallback(
    (action, payload) => {
      switch (action) {
        case "addConnection":
          setIsConnecting(true);
          setConnectingFrom(payload.nodeId);
          break;

        case "deleteNode":
          if (payload.nodeId === "root-node") return; // Don't delete root
          setNodes((nds) => nds.filter((node) => node.id !== payload.nodeId));
          setEdges((eds) =>
            eds.filter(
              (edge) =>
                edge.source !== payload.nodeId && edge.target !== payload.nodeId
            )
          );
          setSelectedNodeId(null);
          break;

        case "copyNode":
          const nodeToCopy = nodes.find((n) => n.id === payload.nodeId);
          if (nodeToCopy) {
            setCopiedNode(nodeToCopy);
          }
          break;

        case "pasteNode":
          if (copiedNode) {
            const newNodeId = `node-${Date.now()}`;
            const pastePosition = {
              x: copiedNode.position.x + 50,
              y: copiedNode.position.y + 50,
            };

            setNodes((nds) => [
              ...nds,
              {
                ...copiedNode,
                id: newNodeId,
                position: pastePosition,
                data: {
                  ...copiedNode.data,
                  label: `${copiedNode.data.label} (Copy)`,
                },
              },
            ]);
            setSelectedNodeId(newNodeId);
          }
          break;

        case "duplicateNode":
          const nodeToDuplicate = nodes.find((n) => n.id === payload.nodeId);
          if (nodeToDuplicate) {
            const newNodeId = `node-${Date.now()}`;
            const duplicatePosition = {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50,
            };

            setNodes((nds) => [
              ...nds,
              {
                ...nodeToDuplicate,
                id: newNodeId,
                position: duplicatePosition,
                data: {
                  ...nodeToDuplicate.data,
                  label: `${nodeToDuplicate.data.label} (Copy)`,
                },
              },
            ]);
            setSelectedNodeId(newNodeId);
          }
          break;
      }
    },
    [nodes, copiedNode, setNodes, setEdges]
  );

  const saveMapData = useCallback(() => {
    const mapData = { nodes, edges };
    const dataStr = JSON.stringify(mapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = "mindmap.json";
    link.click();
  }, [nodes, edges]);

  const loadMapData = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const mapData = JSON.parse(e.target?.result);
            if (mapData.nodes && mapData.edges) {
              setNodes(mapData.nodes);
              setEdges(mapData.edges);
            }
          } catch (error) {
            console.error("Error loading map data:", error);
          }
        };
        reader.readAsText(file);
      }
    },
    [setNodes, setEdges]
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Header */}
      <motion.div
        className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 px-4 py-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <h1 className="text-sm font-semibold text-gray-800">Mind Map</h1>
        </div>
      </motion.div>

      {/* Save/Load Controls - Right Corner */}
      <motion.div
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 p-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <motion.button
            onClick={saveMapData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
          >
            <Save className="w-3 h-3" />
            Save
          </motion.button>

          <label className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition-colors cursor-pointer">
            <Upload className="w-3 h-3" />
            Load
            <input
              type="file"
              accept=".json"
              onChange={loadMapData}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Connection Mode Indicator */}
      {isConnecting && (
        <motion.div
          className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Click on another node to create a connection
        </motion.div>
      )}

      <ReactFlowProvider>
        <div ref={reactFlowWrapper} style={{ width: "100vw", height: "100vh" }}>
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              selected: node.id === selectedNodeId,
              data: {
                ...node.data,
                onNodeDataChange: updateNodeData,
                onToolbarAction: handleToolbarAction,
                onAddChild: addNode,
              },
            }))}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => {
              if (
                isConnecting &&
                connectingFrom &&
                node.id !== connectingFrom
              ) {
                onConnect({
                  source: connectingFrom,
                  target: node.id,
                  sourceHandle: null,
                  targetHandle: null,
                });
              } else {
                setSelectedNodeId(node.id);
              }
            }}
            onPaneClick={() => {
              setSelectedNodeId(null);
              setIsConnecting(false);
              setConnectingFrom(null);
            }}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={{ stroke: "#3b82f6", strokeWidth: 2 }}
            fitView
            fitViewOptions={{
              padding: 0.1,
              minZoom: 0.5,
              maxZoom: 1.5,
            }}
            className="touch-none"
          >
            <Background color="#e2e8f0" gap={20} size={1} variant="dots" />
            <Controls
              className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-lg"
              showInteractive={false}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default MapEditor;
