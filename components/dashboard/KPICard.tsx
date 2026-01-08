import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variation?: number;
  valueColor?: string;
  onAnalyze?: () => void;
  showAnalyzeButton?: boolean;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variation,
  valueColor,
  onAnalyze,
  showAnalyzeButton = false,
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="opacity-80">{icon}</div>}
        </div>
        
        <div className="space-y-2">
          <p className={`text-3xl font-bold ${valueColor || ''}`}>{value}</p>
          
          {variation !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">
                {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
              </span>
            </div>
          )}
          
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}

          {showAnalyzeButton && onAnalyze && (
            <Button
              onClick={onAnalyze}
              variant="outline"
              size="sm"
              className="w-full mt-3 gap-2 border-blue-500/50 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
            >
              <span className="text-base">🔍</span>
              Analisar causa
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}