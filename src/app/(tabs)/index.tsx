import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { PremiumChart } from '../../components/PremiumChart';
import * as Lucide from 'lucide-react-native';

export default function DashboardScreen() {
  const { 
    orders, 
    inventory, 
    virtualDaysElapsed, 
    simulateTimeAdvance 
  } = useApp();

  // Calcular métricas dinâmicas com base no avanço de tempo virtual
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + virtualDaysElapsed);

  const activeOrders = orders.filter(o => o.stage !== 'ready');
  const finishedOrders = orders.filter(o => o.stage === 'ready');
  
  const criticalStockItems = inventory.filter(i => i.status === 'critical');
  
  const delayedOrders = orders.filter(order => {
    const deliveryDate = new Date(order.deliveryDate);
    return currentDate > deliveryDate && order.stage !== 'ready';
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalValue, 0);

  // --- FATURAMENTO DINÂMICO BASEADO NO TEMPO VIRTUAL ---
  const baseDaily = 3200;
  const newDaily = finishedOrders
    .filter(o => new Date(o.stageEntryTime).toDateString() === currentDate.toDateString())
    .reduce((sum, o) => sum + o.totalValue, 0);
  const dailyBilling = baseDaily + newDaily;

  const baseMonthly = 18600;
  const newMonthly = finishedOrders.reduce((sum, o) => sum + o.totalValue, 0);
  const monthlyBilling = baseMonthly + newMonthly;

  const baseAnnual = 142000;
  const annualBilling = baseAnnual + newMonthly;

  // Dados semanais de produção fictícios
  // Vamos somar os valores reais baseados nos pedidos completados para o gráfico ou simular uma curva realista
  const weeklyData = [12, 19, 15, 22, 18, 30, finishedOrders.length + 8];
  const weeklyLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'];

  return (
    <ScrollView className="flex-1 bg-monday-darkBg px-4 pt-4">
      
      {/* Bloco do Simulador de Tempo Virtual */}
      <View className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-3xl mb-6 flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="text-white font-extrabold text-sm flex-row items-center">
            <Lucide.Clock size={16} className="text-brand-400 mr-1.5" />
            Tempo Virtual Ativo
          </Text>
          <Text className="text-gray-400 text-xs mt-1">
            Simulando avanço de prazos. Dia virtual atual: <Text className="text-brand-300 font-bold">+{virtualDaysElapsed} dias</Text>
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={simulateTimeAdvance}
          activeOpacity={0.8}
          className="bg-brand-500 hover:bg-brand-600 px-4 py-2.5 rounded-2xl flex-row items-center border border-brand-400/25"
          style={{ elevation: 3 }}
        >
          <Lucide.FastForward size={14} fill="white" className="text-white mr-1.5" />
          <Text className="text-white font-black text-xs uppercase tracking-wider">Simular +24h</Text>
        </TouchableOpacity>
      </View>

      {/* Título de Seção */}
      <Text className="text-white font-black text-lg mb-4">Painel Executivo</Text>

      {/* Grid de KPIs (2 colunas) */}
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%]">
          <StatCard
            title="Pedidos Ativos"
            value={activeOrders.length}
            subtitle="Em linha de produção"
            icon="Activity"
            color="blue"
            trend={{ type: 'up', value: '+12%' }}
          />
        </View>
        <View className="w-[48%]">
          <StatCard
            title="Estoque Crítico"
            value={criticalStockItems.length}
            subtitle="Insumos abaixo do mínimo"
            icon="AlertOctagon"
            color={criticalStockItems.length > 0 ? 'rose' : 'emerald'}
          />
        </View>
        <View className="w-[48%]">
          <StatCard
            title="Atrasos Ativos"
            value={delayedOrders.length}
            subtitle="Pedidos vencidos"
            icon="AlertTriangle"
            color={delayedOrders.length > 0 ? 'rose' : 'emerald'}
          />
        </View>
        <View className="w-[48%]">
          <StatCard
            title="Receita Estimada"
            value={`R$ ${(totalRevenue / 1000).toFixed(1)}k`}
            subtitle="Volume financeiro total"
            icon="DollarSign"
            color="emerald"
            trend={{ type: 'up', value: '+8.4%' }}
          />
        </View>
      </View>

      {/* Seção de Faturamento e Receitas Corporativas */}
      <View className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-4 rounded-3xl mb-6">
        <View className="flex-row items-center mb-3">
          <Lucide.Coins size={18} className="text-emerald-400 mr-2" />
          <Text className="text-white font-bold text-sm">Faturamento & Receitas</Text>
        </View>

        <View className="flex-row justify-between space-x-2">
          {/* Faturamento Diário */}
          <View className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-2xl items-center mr-1">
            <Text className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Diário</Text>
            <Text className="text-emerald-400 font-black text-sm mt-1">R$ {dailyBilling.toLocaleString('pt-BR')}</Text>
            <Text className="text-gray-500 text-[8px] mt-0.5">Virtual Hoje</Text>
          </View>

          {/* Faturamento Mensal */}
          <View className="flex-1 bg-brand-500/5 border border-brand-500/20 p-3 rounded-2xl items-center mx-1">
            <Text className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Mensal</Text>
            <Text className="text-brand-300 font-black text-sm mt-1">R$ {monthlyBilling.toLocaleString('pt-BR')}</Text>
            <Text className="text-gray-500 text-[8px] mt-0.5">Mês de Referência</Text>
          </View>

          {/* Faturamento Anual */}
          <View className="flex-1 bg-blue-500/5 border border-blue-500/20 p-3 rounded-2xl items-center ml-1">
            <Text className="text-gray-400 font-bold text-[9px] uppercase tracking-wider">Anual</Text>
            <Text className="text-blue-400 font-black text-sm mt-1">R$ {annualBilling.toLocaleString('pt-BR')}</Text>
            <Text className="text-gray-500 text-[8px] mt-0.5">Ano Vigente</Text>
          </View>
        </View>
      </View>

      {/* Gráfico SVG customizado Premium */}
      <PremiumChart data={weeklyData} labels={weeklyLabels} />

      {/* Tabela de Insumos Críticos (Estilo Monday.com) */}
      {criticalStockItems.length > 0 && (
        <View className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-4 rounded-3xl mb-6">
          <View className="flex-row items-center mb-3">
            <Lucide.ShieldAlert size={18} className="text-rose-400 mr-2" />
            <Text className="text-white font-bold text-sm">Alertas de Reposição Crítica</Text>
          </View>
          
          <View className="border-t border-monday-darkGridBorder/50 mt-1">
            {criticalStockItems.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-monday-darkGridBorder/40">
                <View className="flex-1 pr-2">
                  <Text className="text-white font-semibold text-xs">{item.name}</Text>
                  <Text className="text-gray-500 text-[10px] uppercase">{item.category}</Text>
                </View>
                
                {/* Visualização de status estilo Monday */}
                <View className="flex-row items-center space-x-2">
                  <View className="items-end mr-3">
                    <Text className="text-rose-400 font-black text-xs">{item.quantity} {item.unit}</Text>
                    <Text className="text-gray-500 text-[9px]">Mín: {item.minQuantity} {item.unit}</Text>
                  </View>
                  <View className="bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                    <Text className="text-rose-400 font-bold text-[9px] uppercase tracking-wider">Crítico</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Pedidos em Atraso */}
      {delayedOrders.length > 0 && (
        <View className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-3xl mb-10">
          <View className="flex-row items-center mb-3">
            <Lucide.AlertCircle size={18} className="text-rose-400 mr-2" />
            <Text className="text-white font-bold text-sm">Gargalos de Produção (Atrasos)</Text>
          </View>
          
          <View className="space-y-3">
            {delayedOrders.map((order) => {
              const daysLate = Math.round(
                (currentDate.getTime() - new Date(order.deliveryDate).getTime()) / (1000 * 3600 * 24)
              );
              
              return (
                <View key={order.id} className="bg-black/35 p-3 rounded-2xl border border-rose-500/20 flex-row justify-between items-center">
                  <View className="flex-1 pr-2">
                    <Text className="text-white font-bold text-xs">{order.modelName}</Text>
                    <Text className="text-gray-400 text-[10px] mt-0.5">Cliente: {order.customerName} | Etapa: {order.stage.toUpperCase()}</Text>
                  </View>
                  <View className="bg-rose-500 px-2.5 py-1 rounded-xl">
                    <Text className="text-white font-extrabold text-[9px] uppercase">+{daysLate} Dias Atrasado</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View className="h-6" />
    </ScrollView>
  );
}
