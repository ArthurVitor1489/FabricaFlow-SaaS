import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Lucide from 'lucide-react-native';
import { Order, KanbanStage, calculateStockConsumption } from '../services/mockDb';

interface KanbanCardProps {
  order: Order;
  onAdvance?: (id: string) => void;
  showActions: boolean;
  virtualDaysElapsed: number;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  order,
  onAdvance,
  showActions,
  virtualDaysElapsed
}) => {
  // Ícones com fallbacks universais à prova de falhas
  const ArmchairIcon = Lucide.Armchair || Lucide.Info;
  const AlertIcon = Lucide.AlertTriangle || Lucide.Info;
  const PackageIcon = Lucide.Package || Lucide.Info;
  const PlayIcon = Lucide.Play || Lucide.Info;
  const CheckIcon = Lucide.CheckCircle || Lucide.Info;

  // Calcular se o pedido está atrasado em relação ao tempo virtual simulado
  // O tempo virtual avança virtualDaysElapsed dias a partir da criação
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + virtualDaysElapsed);
  
  const deliveryDate = new Date(order.deliveryDate);
  const isDelayed = currentDate > deliveryDate && order.stage !== 'ready';

  const priorityColors = {
    high: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', label: 'Alta' },
    medium: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', label: 'Média' },
    low: { bg: 'bg-gray-500/10 border-gray-500/30', text: 'text-gray-400', label: 'Baixa' }
  };

  const priority = priorityColors[order.priority] || priorityColors.medium;

  const stageLabels = {
    backlog: { name: 'Aguardando', next: 'Iniciar Corte', progress: 15, color: 'bg-blue-500' },
    prep: { name: 'Corte & Costura', next: 'Enviar p/ Tapeçaria', progress: 40, color: 'bg-orange-500' },
    upholstery: { name: 'Tapeçaria', next: 'Enviar p/ Montagem', progress: 65, color: 'bg-purple-500' },
    assembly: { name: 'Montagem & Acabam.', next: 'Finalizar e Expedir', progress: 85, color: 'bg-amber-500' },
    ready: { name: 'Pronto p/ Entrega', next: '', progress: 100, color: 'bg-emerald-500' }
  };

  const currentStageInfo = stageLabels[order.stage];

  // Materiais que serão consumidos na PRÓXIMA etapa ao avançar
  const stages: KanbanStage[] = ['backlog', 'prep', 'upholstery', 'assembly', 'ready'];
  const currentIndex = stages.indexOf(order.stage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  const materialsToConsume = nextStage 
    ? calculateStockConsumption(order.productType, order.quantity, nextStage) 
    : [];

  return (
    <View 
      className={`bg-monday-darkGridBorder/30 border ${isDelayed ? 'border-rose-600' : 'border-monday-darkGridBorder/80'} p-4 rounded-2xl mb-4`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }}
    >
      {/* Cabeçalho do Card */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center">
          <View className={`p-2 rounded-xl bg-brand-500/15 mr-2.5`}>
            {order.productType === 'sofa' ? (
              <ArmchairIcon size={18} className="text-brand-400" />
            ) : (
              <ArmchairIcon size={18} className="text-amber-400" />
            )}
          </View>
          <View>
            <Text className="text-white font-bold text-sm leading-tight pr-12" numberOfLines={1}>
              {order.modelName}
            </Text>
            <Text className="text-gray-400 text-xs mt-0.5">
              Ref: #{order.id.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Badge de Prioridade */}
        <View className={`px-2 py-0.5 rounded border ${priority.bg}`}>
          <Text className={`text-[10px] font-bold uppercase ${priority.text}`}>
            {priority.label}
          </Text>
        </View>
      </View>

      {/* Alerta de Atraso */}
      {isDelayed && (
        <View className="bg-rose-500/10 border border-rose-500/30 flex-row items-center p-2 rounded-xl mb-3">
          <AlertIcon size={14} className="text-rose-400 mr-1.5" />
          <Text className="text-rose-400 text-xs font-bold uppercase tracking-wider">
            ATRASADO (Prazo: {new Date(order.deliveryDate).toLocaleDateString('pt-BR')})
          </Text>
        </View>
      )}

      {/* Detalhes de Customização */}
      <View className="space-y-1.5 mb-3.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
        <View className="flex-row justify-between">
          <Text className="text-gray-400 text-xs">Tecido:</Text>
          <Text className="text-white text-xs font-medium">{order.fabricType} ({order.fabricColor})</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-400 text-xs">Quantidade:</Text>
          <Text className="text-white text-xs font-bold">{order.quantity} un</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-400 text-xs">Cliente:</Text>
          <Text className="text-brand-300 text-xs font-medium">{order.customerName}</Text>
        </View>
        {order.observations && (
          <View className="mt-1 pt-1 border-t border-white/5">
            <Text className="text-[11px] text-amber-400/90 italic" numberOfLines={2}>
              Obs: "{order.observations}"
            </Text>
          </View>
        )}
      </View>

      {/* Barra de Progresso do Estágio */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-400 text-xs font-semibold">Progresso da Linha:</Text>
          <Text className="text-white text-xs font-bold">{currentStageInfo.progress}%</Text>
        </View>
        <View className="w-full h-1.5 bg-monday-darkGridBorder/80 rounded-full overflow-hidden">
          <View className={`h-full ${currentStageInfo.color} rounded-full`} style={{ width: `${currentStageInfo.progress}%` }} />
        </View>
      </View>

      {/* Mostrar próximos materiais a serem deduzidos do estoque */}
      {materialsToConsume.length > 0 && showActions && (
        <View className="bg-brand-500/5 border border-brand-500/10 p-2.5 rounded-xl mb-4">
          <View className="flex-row items-center mb-1">
            <PackageIcon size={12} className="text-brand-400 mr-1" />
            <Text className="text-[10px] text-brand-300 font-bold uppercase tracking-wider">
              Materiais p/ Próxima Etapa:
            </Text>
          </View>
          <View className="flex-wrap flex-row gap-1">
            {materialsToConsume.map((mat, i) => (
              <View key={i} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                <Text className="text-[9px] text-gray-300 font-medium">
                  {mat.name.split(' ')[0]}: <Text className="text-brand-300 font-bold">-{mat.quantity}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Botões de Ação para Operador/Gerente */}
      {showActions && order.stage !== 'ready' && onAdvance && (
        <TouchableOpacity
          onPress={() => onAdvance(order.id)}
          activeOpacity={0.85}
          className="bg-brand-500 hover:bg-brand-600 flex-row items-center justify-center py-3 rounded-xl border border-brand-400/20"
        >
          <PlayIcon size={16} fill="white" className="text-white mr-1.5" />
          <Text className="text-white font-bold text-xs uppercase tracking-wider">
            {currentStageInfo.next}
          </Text>
        </TouchableOpacity>
      )}

      {order.stage === 'ready' && (
        <View className="bg-emerald-500/15 border border-emerald-500/30 flex-row items-center justify-center py-2.5 rounded-xl">
          <CheckIcon size={16} className="text-emerald-400 mr-1.5" />
          <Text className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
            Aguardando Expedição
          </Text>
        </View>
      )}
    </View>
  );
};
