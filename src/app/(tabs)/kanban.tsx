import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useApp } from '../../context/AppContext';
import { KanbanCard } from '../../components/KanbanCard';
import { KanbanStage } from '../../services/mockDb';
import * as Lucide from 'lucide-react-native';

export default function KanbanScreen() {
  const { orders, advanceOrder, virtualDaysElapsed, role } = useApp();
  const [selectedStage, setSelectedStage] = useState<KanbanStage>('backlog');

  const stagesList: { id: KanbanStage; label: string; icon: keyof typeof Lucide; color: string }[] = [
    { id: 'backlog', label: 'Aguardando', icon: 'Inbox', color: 'text-blue-400' },
    { id: 'prep', label: 'Corte & Costura', icon: 'Scissors', color: 'text-orange-400' },
    { id: 'upholstery', label: 'Tapeçaria', icon: 'Armchair', color: 'text-purple-400' },
    { id: 'assembly', label: 'Montagem', icon: 'Hammer', color: 'text-amber-400' },
    { id: 'ready', label: 'Pronto/Expedição', icon: 'Package', color: 'text-emerald-400' }
  ];

  // Contagem de pedidos por estágio
  const getStageCount = (stageId: KanbanStage) => {
    return orders.filter(o => o.stage === stageId).length;
  };

  const filteredOrders = orders.filter(o => o.stage === selectedStage);

  return (
    <View className="flex-1 bg-monday-darkBg">
      
      {/* Seletor de Estágio Horizontal (Inspirado no Trello/Monday) */}
      <View className="border-b border-monday-darkGridBorder/60 py-3 bg-monday-darkBg">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {stagesList.map((stage) => {
            const isSelected = selectedStage === stage.id;
            const count = getStageCount(stage.id);
            const IconComponent = Lucide[stage.icon] as React.ComponentType<any>;

            return (
              <TouchableOpacity
                key={stage.id}
                onPress={() => setSelectedStage(stage.id)}
                activeOpacity={0.8}
                className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 border ${
                  isSelected 
                    ? 'bg-brand-500 border-brand-400/30' 
                    : 'bg-monday-darkGridBorder/20 border-monday-darkGridBorder/60'
                }`}
                style={isSelected ? {
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3
                } : {}}
              >
                <IconComponent 
                  size={16} 
                  className={`${isSelected ? 'text-white' : stage.color} mr-2`} 
                />
                <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {stage.label}
                </Text>
                
                {/* Contador de Pedidos */}
                <View className={`ml-2.5 px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-monday-darkGridBorder/50'}`}>
                  <Text className={`text-[10px] font-black ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Cartões (Pedidos Filtrados por Estágio Selecionado) */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-20 bg-monday-darkGridBorder/10 border border-monday-darkGridBorder/40 border-dashed rounded-3xl mt-4">
            <Lucide.Inbox size={48} className="text-gray-600 mb-3" />
            <Text className="text-gray-400 font-bold text-sm">Nenhum pedido nesta etapa</Text>
            <Text className="text-gray-600 text-xs text-center px-8 mt-1">
              Novos pedidos ou pedidos avançados de etapas anteriores aparecerão aqui automaticamente.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <KanbanCard
              key={order.id}
              order={order}
              onAdvance={advanceOrder}
              showActions={true} // Sempre mostra ações para operadores/gerentes no Kanban
              virtualDaysElapsed={virtualDaysElapsed}
            />
          ))
        )}
        <View className="h-10" />
      </ScrollView>
      
    </View>
  );
}
