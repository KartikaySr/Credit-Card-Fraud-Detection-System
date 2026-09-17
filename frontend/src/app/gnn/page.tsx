import GraphNetwork from '@/components/dashboard/GraphNetwork';
import SubgraphViewer from '@/components/gnn/SubgraphViewer';
import NodeCentrality from '@/components/gnn/NodeCentrality';
import EdgeHeatmap from '@/components/gnn/EdgeHeatmap';

export default function GNNPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-tight">
          Graph Neural Networks
        </h1>
        <p className="text-gray-400 mt-2">Topological analysis of transaction networks and fraud rings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SubgraphViewer />
          <EdgeHeatmap />
        </div>
        <div className="space-y-8">
          <GraphNetwork />
          <NodeCentrality />
        </div>
      </div>
    </div>
  );
}
