import EntanglementMatrix from '@/components/quantum/EntanglementMatrix';
import QuantumAdvantageChart from '@/components/quantum/QuantumAdvantageChart';
import HardwareStatus from '@/components/quantum/HardwareStatus';
import QuantumState from '@/components/dashboard/QuantumState';

export default function QuantumPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600 tracking-tight">
          Quantum Co-Processor
        </h1>
        <p className="text-gray-400 mt-2">Deep-dive into the hybrid QNN state and entanglement metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuantumAdvantageChart />
        </div>
        <div className="space-y-8">
          <QuantumState />
          <HardwareStatus />
        </div>
      </div>

      <EntanglementMatrix />
    </div>
  );
}
