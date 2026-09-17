import LiveFeed from '@/components/streaming/LiveFeed';
import KafkaHealth from '@/components/streaming/KafkaHealth';
import FeatureHistogram from '@/components/streaming/FeatureHistogram';

export default function StreamingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-500 tracking-tight">
          Live Streaming Pipeline
        </h1>
        <p className="text-gray-400 mt-2">Real-time Kafka ingestion and feature distributions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LiveFeed />
          <FeatureHistogram />
        </div>
        <div>
          <KafkaHealth />
        </div>
      </div>
    </div>
  );
}
