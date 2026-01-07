import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variation?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  valueColor?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  variation,
  icon,
  trend,
  valueColor = 'text-foreground'
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-3xl font-bold", valueColor)}>
                {value}
              </p>
              {variation !== undefined && (
                <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
                  {getTrendIcon()}
                  <span>{Math.abs(variation).toFixed(1)}%</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
