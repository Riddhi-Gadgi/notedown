import { Handle, Position } from 'reactflow';

const NodeHandle = ({ selected }) => {
  if (!selected) return null;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white"
      />
    </>
  );
};

export default NodeHandle;