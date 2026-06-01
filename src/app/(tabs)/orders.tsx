import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Modal
} from 'react-native';
import { useApp } from '../../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function OrdersScreen() {
  const { orders, customers, createOrder } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [productType, setProductType] = useState<'sofa' | 'chair'>('sofa');
  const [modelName, setModelName] = useState('');
  const [fabricType, setFabricType] = useState('Linho Fino');
  const [fabricColor, setFabricColor] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [observations, setObservations] = useState('');
  const [price, setPrice] = useState('');

  const handleCreateOrder = () => {
    if (!modelName || !fabricColor || !price) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    // Calcular data de entrega padrão de 7 dias úteis
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 7);

    createOrder({
      customerId: selectedCustomerId,
      customerName: customer.name,
      productType,
      modelName,
      fabricType,
      fabricColor,
      quantity: parseInt(quantity) || 1,
      deliveryDate: delivery.toISOString(),
      priority,
      observations,
      totalValue: parseFloat(price) || 0
    });

    // Reset Form
    setModelName('');
    setFabricColor('');
    setPrice('');
    setObservations('');
    setQuantity('1');
    setShowModal(false);
  };

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => 
    order.modelName.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-monday-darkBg">
      
      {/* Barra de Pesquisa & Botão Adicionar */}
      <View className="flex-row items-center px-4 py-4 space-x-3 bg-monday-darkBg border-b border-monday-darkGridBorder/50">
        <View className="flex-1 flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 mr-2">
          <Lucide.Search size={16} className="text-gray-400 mr-2" />
          <TextInput
            placeholder="Pesquisar por modelo ou cliente..."
            placeholderTextColor="#6b7280"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-white text-xs"
          />
        </View>
        
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
          className="bg-brand-500 hover:bg-brand-600 p-3 rounded-2xl flex-row items-center border border-brand-400/20"
        >
          <Lucide.Plus size={16} className="text-white" />
        </TouchableOpacity>
      </View>

      {/* Lista de Pedidos Cadastrados */}
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-white font-black text-base mb-4">Pedidos em Carteira ({filteredOrders.length})</Text>

        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-20 bg-monday-darkGridBorder/10 border border-monday-darkGridBorder/40 border-dashed rounded-3xl mt-2">
            <Lucide.ClipboardList size={40} className="text-gray-600 mb-2" />
            <Text className="text-gray-400 text-xs font-bold">Nenhum pedido encontrado</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const stageColor = {
              backlog: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
              prep: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
              upholstery: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
              assembly: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
              ready: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }[order.stage];

            const priorityLabel = {
              high: 'Alta',
              medium: 'Média',
              low: 'Baixa'
            }[order.priority];

            return (
              <View 
                key={order.id} 
                className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-4 rounded-2xl mb-4"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-sm">{order.modelName}</Text>
                    <Text className="text-gray-400 text-xs mt-0.5">Cliente: {order.customerName}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded border ${stageColor}`}>
                    <Text className="text-[10px] font-bold uppercase">{order.stage}</Text>
                  </View>
                </View>

                {/* Sub-informações detalhadas */}
                <View className="flex-row flex-wrap mt-3 pt-3 border-t border-monday-darkGridBorder/40 gap-x-4 gap-y-2">
                  <View className="flex-row items-center">
                    <Lucide.Tag size={12} className="text-gray-500 mr-1" />
                    <Text className="text-gray-400 text-[11px]">Tecido: <Text className="text-gray-200 font-semibold">{order.fabricColor} ({order.fabricType})</Text></Text>
                  </View>
                  <View className="flex-row items-center">
                    <Lucide.ShoppingBag size={12} className="text-gray-500 mr-1" />
                    <Text className="text-gray-400 text-[11px]">Qtd: <Text className="text-gray-200 font-bold">{order.quantity}</Text></Text>
                  </View>
                  <View className="flex-row items-center">
                    <Lucide.DollarSign size={12} className="text-gray-500 mr-1" />
                    <Text className="text-gray-400 text-[11px]">Valor: <Text className="text-emerald-400 font-extrabold">R$ {order.totalValue}</Text></Text>
                  </View>
                  <View className="flex-row items-center">
                    <Lucide.Calendar size={12} className="text-gray-500 mr-1" />
                    <Text className="text-gray-400 text-[11px]">Prazo: <Text className="text-gray-200 font-medium">{new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</Text></Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>

      {/* Modal de Criação de Pedido */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-monday-darkBg border-t border-monday-darkGridBorder/80 rounded-t-[32px] p-6 max-h-[85%]">
            
            {/* Header Modal */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-lg font-black">Cadastrar Novo Pedido</Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)}
                className="p-1 rounded-full bg-white/10"
              >
                <Lucide.X size={18} className="text-gray-300" />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4" showsVerticalScrollIndicator={false}>
              
              {/* Seleção do Cliente */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cliente CRM *</Text>
                <View className="bg-black/40 border border-white/10 rounded-2xl p-0.5">
                  {customers.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      onPress={() => setSelectedCustomerId(c.id)}
                      className={`px-4 py-3 rounded-xl ${selectedCustomerId === c.id ? 'bg-brand-500/20 border border-brand-500/40' : ''}`}
                    >
                      <Text className={`text-xs ${selectedCustomerId === c.id ? 'text-brand-300 font-bold' : 'text-gray-300'}`}>
                        {c.name} ({c.city})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tipo de Produto */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tipo de Móvel *</Text>
                <View className="flex-row bg-black/40 border border-white/10 p-1 rounded-2xl">
                  <TouchableOpacity
                    onPress={() => setProductType('sofa')}
                    className={`flex-1 flex-row justify-center py-3 rounded-xl ${productType === 'sofa' ? 'bg-brand-500' : ''}`}
                  >
                    <Text className={`font-bold text-xs ${productType === 'sofa' ? 'text-white' : 'text-gray-400'}`}>Sofá</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setProductType('chair')}
                    className={`flex-1 flex-row justify-center py-3 rounded-xl ${productType === 'chair' ? 'bg-brand-500' : ''}`}
                  >
                    <Text className={`font-bold text-xs ${productType === 'chair' ? 'text-white' : 'text-gray-400'}`}>Cadeira</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Modelo */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Modelo *</Text>
                <TextInput
                  placeholder="Ex: Sofá Living Premium Itália"
                  placeholderTextColor="#6b7280"
                  value={modelName}
                  onChangeText={setModelName}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs"
                />
              </View>

              {/* Tecido & Cor */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tecido *</Text>
                  <TextInput
                    placeholder="Ex: Linho Rústico"
                    placeholderTextColor="#6b7280"
                    value={fabricType}
                    onChangeText={setFabricType}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cor *</Text>
                  <TextInput
                    placeholder="Ex: Azul Petróleo"
                    placeholderTextColor="#6b7280"
                    value={fabricColor}
                    onChangeText={setFabricColor}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs"
                  />
                </View>
              </View>

              {/* Quantidade & Preço */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Qtd *</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Preço Total (R$) *</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Ex: 3500"
                    placeholderTextColor="#6b7280"
                    value={price}
                    onChangeText={setPrice}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs"
                  />
                </View>
              </View>

              {/* Prioridade */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Urgência *</Text>
                <View className="flex-row bg-black/40 border border-white/10 p-1 rounded-2xl">
                  {(['low', 'medium', 'high'] as const).map((p) => {
                    const label = p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta';
                    return (
                      <TouchableOpacity
                        key={p}
                        onPress={() => setPriority(p)}
                        className={`flex-1 py-3 rounded-xl items-center ${priority === p ? 'bg-brand-500' : ''}`}
                      >
                        <Text className={`font-bold text-xs ${priority === p ? 'text-white' : 'text-gray-400'}`}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Observações */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Instruções Especiais</Text>
                <TextInput
                  placeholder="Ex: Almofadas extras soltas, pés na tonalidade mel..."
                  placeholderTextColor="#6b7280"
                  value={observations}
                  onChangeText={setObservations}
                  multiline
                  numberOfLines={3}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white text-xs h-20 text-start"
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                onPress={handleCreateOrder}
                activeOpacity={0.8}
                className="bg-brand-500 py-4 rounded-2xl items-center border border-brand-400/20 mt-4 mb-10"
              >
                <Text className="text-white font-extrabold text-sm uppercase tracking-wider">Criar Pedido de Produção</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}
