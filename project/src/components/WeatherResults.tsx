import { Download, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { WeatherResults as WeatherResultsType } from '../types/weather';

interface WeatherResultsProps {
  results: WeatherResultsType;
}

function WeatherResults({ results }: WeatherResultsProps) {
  const exportToCSV = () => {
    const headers = ['Parameter', 'Mean', 'Probability (%)', 'Threshold', 'Unit', 'Min (Historical)', 'Max (Historical)'];
    const rows = results.data.map(d => [
      d.parameter,
      d.mean.toFixed(2),
      d.probability.toFixed(1),
      d.threshold,
      d.unit,
      d.historicalRange.min.toFixed(2),
      d.historicalRange.max.toFixed(2)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-analysis-${results.location.replace(/\s+/g, '-')}-${results.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-analysis-${results.location.replace(/\s+/g, '-')}-${results.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getRiskLevel = (probability: number) => {
    if (probability >= 70) return {
      level: 'High Risk',
      color: 'text-red-700',
      bg: 'bg-gradient-to-br from-red-100 to-pink-100',
      border: 'border-red-300',
      icon: AlertTriangle
    };
    if (probability >= 40) return {
      level: 'Moderate Risk',
      color: 'text-yellow-700',
      bg: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      border: 'border-yellow-300',
      icon: TrendingUp
    };
    return {
      level: 'Low Risk',
      color: 'text-green-700',
      bg: 'bg-gradient-to-br from-green-100 to-emerald-100',
      border: 'border-green-300',
      icon: CheckCircle
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Analysis Results
              </h2>
            </div>
            <p className="text-lg text-gray-700 font-semibold">
              📍 {results.location}
            </p>
            <p className="text-md text-gray-600">
              📅 {new Date(results.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              🌐 Coordinates: {results.coordinates.lat.toFixed(4)}°, {results.coordinates.lon.toFixed(4)}°
            </p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all shadow-lg transform hover:scale-105 font-semibold"
            >
              <Download className="w-5 h-5" />
              CSV
            </button>
            <button
              onClick={exportToJSON}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all shadow-lg transform hover:scale-105 font-semibold"
            >
              <Download className="w-5 h-5" />
              JSON
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.data.map((dataPoint, index) => {
            const risk = getRiskLevel(dataPoint.probability);
            const RiskIcon = risk.icon;

            return (
              <div
                key={index}
                className={`${risk.bg} border-2 ${risk.border} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{dataPoint.parameter}</h3>
                  <div className={`${risk.color} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 bg-white shadow-md`}>
                    <RiskIcon className="w-4 h-4" />
                    {risk.level}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700 font-semibold">Probability</span>
                      <span className={`text-2xl font-bold ${risk.color}`}>
                        {dataPoint.probability.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3 shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all shadow-md ${
                          dataPoint.probability >= 70 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                          dataPoint.probability >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        style={{ width: `${Math.min(dataPoint.probability, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t-2 border-white">
                    <div className="bg-white bg-opacity-60 rounded-lg p-2">
                      <p className="text-xs text-gray-600 font-semibold">Mean</p>
                      <p className="text-sm font-bold text-gray-900">
                        {dataPoint.mean.toFixed(1)} {dataPoint.unit}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-lg p-2">
                      <p className="text-xs text-gray-600 font-semibold">Threshold</p>
                      <p className="text-sm font-bold text-gray-900">
                        {dataPoint.threshold} {dataPoint.unit}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-lg p-2">
                      <p className="text-xs text-gray-600 font-semibold">Min</p>
                      <p className="text-sm font-bold text-gray-900">
                        {dataPoint.historicalRange.min.toFixed(1)} {dataPoint.unit}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-60 rounded-lg p-2">
                      <p className="text-xs text-gray-600 font-semibold">Max</p>
                      <p className="text-sm font-bold text-gray-900">
                        {dataPoint.historicalRange.max.toFixed(1)} {dataPoint.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-300">
          <p className="text-sm text-gray-800 font-medium">
            <span className="font-bold">💡 Note:</span> These probabilities are based on historical NASA Earth observation data for this location and time of year. Actual weather conditions may vary. This tool provides statistical likelihood, not a weather forecast.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherResults;
