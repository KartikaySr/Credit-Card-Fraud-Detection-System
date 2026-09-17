import GlobalFeatureImportance from '@/components/analytics/GlobalFeatureImportance';
import LocalShap from '@/components/analytics/LocalShap';
import PrecisionRecall from '@/components/analytics/PrecisionRecall';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 tracking-tight">
          AI Analytics & SHAP
        </h1>
        <p className="text-gray-400 mt-2">Deep explainability into the LightGBM and Neural Network models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlobalFeatureImportance />
        <PrecisionRecall />
      </div>

      <LocalShap />
    </div>
  );
}
