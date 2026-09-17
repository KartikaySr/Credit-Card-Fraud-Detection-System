import HistoricalAlertsTable from '@/components/alerts/HistoricalAlertsTable';
import TransactionInjector from '@/components/alerts/TransactionInjector';
import VelocityChart from '@/components/alerts/VelocityChart';

export default function AlertsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 tracking-tight">
          Transaction Intelligence
        </h1>
        <p className="text-gray-400 mt-2">Deep dive into historical fraud alerts and inject test vectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VelocityChart />
        </div>
        <div>
          <TransactionInjector />
        </div>
      </div>

      <HistoricalAlertsTable />
    </div>
  );
}
