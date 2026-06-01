import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Lucide from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Lucide;
  color: 'emerald' | 'rose' | 'amber' | 'blue' | 'purple';
  trend?: {
    type: 'up' | 'down';
    value: string;
  };
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  onPress
}) => {
  const IconComponent = (Lucide[icon] || Lucide.Info) as React.ComponentType<any>;

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      iconBg: 'bg-rose-500/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/20'
    },
    blue: {
      bg: 'bg-trello-blue/10',
      border: 'border-trello-blue/30',
      text: 'text-blue-400',
      iconBg: 'bg-trello-blue/20'
    },
    purple: {
      bg: 'bg-monday-purple/10',
      border: 'border-monday-purple/30',
      text: 'text-purple-400',
      iconBg: 'bg-monday-purple/20'
    }
  };

  const scheme = colorClasses[color];

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      activeOpacity={0.8}
      className={`p-4 rounded-2xl border ${scheme.bg} ${scheme.border} flex-row justify-between items-center mb-4`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }}
    >
      <View className="flex-1 pr-2">
        <Text className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">
          {title}
        </Text>
        <Text className={`text-2xl font-bold ${scheme.text}`}>
          {value}
        </Text>
        {subtitle && (
          <Text className="text-gray-500 text-xs mt-1">
            {subtitle}
          </Text>
        )}
        
        {trend && (
          <View className="flex-row items-center mt-2">
            {trend.type === 'up' ? (
              <Lucide.ArrowUpRight size={14} className="text-emerald-400 mr-1" />
            ) : (
              <Lucide.ArrowDownRight size={14} className="text-rose-400 mr-1" />
            )}
            <Text className={`text-xs font-semibold ${trend.type === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.value}
            </Text>
            <Text className="text-gray-500 text-[10px] ml-1">vs ontem</Text>
          </View>
        )}
      </View>

      <View className={`p-3 rounded-xl ${scheme.iconBg}`}>
        {IconComponent && <IconComponent size={24} className={scheme.text} />}
      </View>
    </CardWrapper>
  );
};
