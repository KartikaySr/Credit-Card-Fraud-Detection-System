import FederatedLearning from '@/components/dashboard/FederatedLearning';
import NodeMap from '@/components/federated/NodeMap';
import RoundTracker from '@/components/federated/RoundTracker';
import ModelDriftChart from '@/components/federated/ModelDriftChart';

export default function FederatedPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 tracking-tight">
          Federated Learning Network
        </h1>
        <p className="text-gray-400 mt-2">Decentralized training intelligence across global banking nodes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <NodeMap />
          <ModelDriftChart />
        </div>
        <div className="space-y-8">
          <FederatedLearning />
          <RoundTracker />
        </div>
      </div>
    </div>
  );
}
