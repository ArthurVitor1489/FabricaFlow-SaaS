import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useApp } from '../../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function DeliveryScreen() {
  const { deliveries, signDelivery } = useApp();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [driverInput, setDriverInput] = useState('Marcos Souza');
  
  // Lógica para Canvas de Assinatura
  const [signedName, setSignedName] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  const activeDeliveries = deliveries.filter(d => d.status !== 'delivered');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  const handleConfirmDelivery = () => {
    if (!selectedDeliveryId) return;
    if (!signedName) {
      alert('Por favor, digite o nome do recebedor para confirmar a assinatura!');
      return;
    }
    
    // Gerar uma assinatura simulada em base64 estilizada
    const cursiveSignature = `data:image/svg+xml;utf8,<svg ...>${signedName}</svg>`;
    signDelivery(selectedDeliveryId, cursiveSignature);
    
    // Reset
    setSelectedDeliveryId(null);
    setSignedName('');
    setIsSigned(false);
  };

  return (
    <View className="flex-1 bg-monday-darkBg">
      <ScrollView className="flex-1 px-4 pt-4">
        
        {/* Entregas Pendentes */}
        <Text className="text-white font-black text-base mb-4">Entregas Pendentes ({activeDeliveries.length})</Text>

        {activeDeliveries.length === 0 ? (
          <View className="items-center justify-center py-10 bg-monday-darkGridBorder/10 border border-monday-darkGridBorder/40 border-dashed rounded-3xl mb-6">
            <Lucide.Truck size={40} className="text-gray-600 mb-2" />
            <Text className="text-gray-400 text-xs font-bold">Nenhuma entrega agendada</Text>
            <Text className="text-gray-600 text-[10px] mt-1">Avance pedidos até a etapa "Pronto/Expedição" no Kanban.</Text>
          </View>
        ) : (
          activeDeliveries.map((del) => (
            <View 
              key={del.id} 
              className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-4 rounded-2xl mb-4"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View>
                  <Text className="text-white font-bold text-sm">{del.customerName}</Text>
                  <Text className="text-[11px] text-gray-500 font-bold uppercase mt-0.5 tracking-wider">Ref: #{del.id.toUpperCase()}</Text>
                </View>
                <View className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  <Text className="text-amber-400 font-bold text-[9px] uppercase tracking-wider">Pendente</Text>
                </View>
              </View>

              {/* Informações Físicas */}
              <View className="bg-black/25 p-3 rounded-xl border border-white/5 space-y-2 mb-4">
                <View className="flex-row items-start">
                  <Lucide.Package size={14} className="text-gray-400 mr-2 mt-0.5" />
                  <Text className="text-gray-300 text-xs flex-1">{del.productInfo}</Text>
                </View>
                <View className="flex-row items-start">
                  <Lucide.MapPin size={14} className="text-gray-400 mr-2 mt-0.5" />
                  <Text className="text-gray-300 text-xs flex-1">{del.address}</Text>
                </View>
                <View className="flex-row items-center">
                  <Lucide.User size={14} className="text-gray-400 mr-2" />
                  <Text className="text-gray-400 text-xs">Motorista: <Text className="text-brand-300 font-semibold">{del.driverName}</Text></Text>
                </View>
              </View>

              {/* Botão de Confirmação */}
              <TouchableOpacity
                onPress={() => setSelectedDeliveryId(del.id)}
                activeOpacity={0.8}
                className="bg-brand-500 py-3 rounded-xl flex-row items-center justify-center border border-brand-400/25"
              >
                <Lucide.FileSignature size={14} className="text-white mr-1.5" />
                <Text className="text-white font-bold text-xs uppercase tracking-wider">Registrar Recebimento</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Entregas Concluídas */}
        <Text className="text-white font-black text-base mt-4 mb-4">Entregas Realizadas ({completedDeliveries.length})</Text>

        {completedDeliveries.length === 0 ? (
          <View className="items-center justify-center py-10 bg-monday-darkGridBorder/10 border border-monday-darkGridBorder/40 border-dashed rounded-3xl mb-10">
            <Lucide.CheckSquare size={36} className="text-gray-600 mb-2" />
            <Text className="text-gray-400 text-xs font-bold">Nenhuma entrega realizada hoje</Text>
          </View>
        ) : (
          completedDeliveries.map((del) => (
            <View 
              key={del.id} 
              className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl mb-4"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-bold text-xs">{del.customerName}</Text>
                <View className="bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                  <Text className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider">Entregue</Text>
                </View>
              </View>
              
              <Text className="text-gray-400 text-xs">{del.productInfo}</Text>
              <Text className="text-gray-500 text-[10px] mt-1.5">Recebido por: {del.driverName} (Assinatura arquivada)</Text>
            </View>
          ))
        )}

        <View className="h-10" />
      </ScrollView>

      {/* Modal de Assinatura Digital de Entrega */}
      <Modal
        visible={selectedDeliveryId !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedDeliveryId(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-monday-darkBg border-t border-monday-darkGridBorder/80 rounded-t-[32px] p-6">
            
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-base font-black">Assinatura Digital de Entrega</Text>
              <TouchableOpacity 
                onPress={() => setSelectedDeliveryId(null)}
                className="p-1 rounded-full bg-white/10"
              >
                <Lucide.X size={18} className="text-gray-300" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              {/* Nome do Recebedor */}
              <View className="mb-4">
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nome Completo do Recebedor</Text>
                <TextInput
                  placeholder="Nome do cliente ou responsável..."
                  placeholderTextColor="#6b7280"
                  value={signedName}
                  onChangeText={(val) => {
                    setSignedName(val);
                    setIsSigned(val.length > 3);
                  }}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Quadro de Assinatura Interativo Simulada */}
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Assinatura Digital na Tela</Text>
              <View className="h-40 bg-black/50 border border-white/10 rounded-2xl justify-center items-center relative overflow-hidden mb-6">
                
                {isSigned ? (
                  <View className="items-center">
                    {/* Linha de assinatura elegante cursiva fictícia */}
                    <Text className="text-brand-400 font-bold text-3xl italic tracking-widest" style={{ transform: [{ rotate: '-3deg' }] }}>
                      {signedName}
                    </Text>
                    <View className="w-48 h-0.5 bg-brand-400/40 mt-2" />
                  </View>
                ) : (
                  <View className="items-center">
                    <Lucide.PenTool size={32} className="text-gray-600 mb-2 animate-bounce" />
                    <Text className="text-gray-500 text-xs text-center px-6">
                      Digite o nome acima para simular a assinatura digital criptografada
                    </Text>
                  </View>
                )}
                
                <View className="absolute bottom-2 right-3 flex-row items-center">
                  <Lucide.ShieldCheck size={12} className="text-emerald-400 mr-1" />
                  <Text className="text-gray-500 text-[8px] uppercase tracking-wider">Criptografia RSA 2048</Text>
                </View>
              </View>

              {/* Confirmar Entrega */}
              <TouchableOpacity
                onPress={handleConfirmDelivery}
                disabled={!isSigned}
                activeOpacity={0.8}
                className={`py-4 rounded-2xl items-center border mb-6 ${
                  isSigned 
                    ? 'bg-brand-500 border-brand-400/20' 
                    : 'bg-monday-darkGridBorder/30 border-white/5'
                }`}
              >
                <Text className={`font-black text-xs uppercase tracking-wider ${isSigned ? 'text-white' : 'text-gray-500'}`}>
                  Confirmar e Finalizar Rota
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
