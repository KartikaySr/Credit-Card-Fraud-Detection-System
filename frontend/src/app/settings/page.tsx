import SimulationControls from '@/components/settings/SimulationControls';
import ThemeConfig from '@/components/settings/ThemeConfig';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600 tracking-tight">
          System Configuration
        </h1>
        <p className="text-gray-400 mt-2">Adjust core pipeline constraints and UI themes.</p>
      </div>

      <div className="space-y-8">
        <SimulationControls />
        <ThemeConfig />
      </div>
    </div>
  );
}
