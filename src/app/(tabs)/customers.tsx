import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Linking } from 'react-native';
import { useApp } from '../../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function CustomersScreen() {
  const { customers, orders, addCustomer } = useApp();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleAddCustomer = () => {
    if (!name || !phone || !email || !address || !city) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    addCustomer({ name, phone, email, address, city });
    
    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setShowModal(false);
  };

  const handleCall = (phoneStr: string) => {
    const cleanPhone = phoneStr.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      alert('Não foi possível abrir o discador no simulador.');
    });
  };

  const handleWhatsApp = (phoneStr: string, customerName: string) => {
    const cleanPhone = '55' + phoneStr.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Olá ${customerName}, gostaríamos de confirmar o andamento do seu pedido na fábrica!`);
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}&text=${message}`).catch(() => {
      // Fallback para web whatsapp
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`).catch(() => {
        alert('Não foi possível abrir o WhatsApp.');
      });
    });
  };

  // Filtrar clientes
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  // Contar histórico de pedidos por cliente
  const getOrdersCount = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId).length;
  };

  return (
    <View className="flex-1 bg-monday-darkBg">
      
      {/* Busca e Adicionar */}
      <View className="flex-row items-center px-4 py-4 space-x-3 bg-monday-darkBg border-b border-monday-darkGridBorder/50">
        <View className="flex-1 flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 mr-2">
          <Lucide.Search size={16} className="text-gray-400 mr-2" />
          <TextInput
            placeholder="Pesquisar cliente por nome..."
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
          <Lucide.UserPlus size={16} className="text-white" />
        </TouchableOpacity>
      </View>

      {/* Lista de Clientes */}
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-white font-black text-base mb-4">Clientes Registrados ({filteredCustomers.length})</Text>

        {filteredCustomers.length === 0 ? (
          <View className="items-center justify-center py-20 bg-monday-darkGridBorder/10 border border-monday-darkGridBorder/40 border-dashed rounded-3xl mt-2">
            <Lucide.Users size={40} className="text-gray-600 mb-2" />
            <Text className="text-gray-400 text-xs font-bold">Nenhum cliente encontrado</Text>
          </View>
        ) : (
          filteredCustomers.map(c => {
            const orderCount = getOrdersCount(c.id);

            return (
              <View 
                key={c.id} 
                className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-4 rounded-2xl mb-4"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="text-white font-extrabold text-sm">{c.name}</Text>
                    <Text className="text-gray-400 text-xs mt-1">{c.city}</Text>
                  </View>
                  
                  {/* Badge de Histórico de Pedidos */}
                  <View className="bg-brand-500/10 border border-brand-500/25 px-2.5 py-1 rounded-xl">
                    <Text className="text-brand-300 font-bold text-[10px] uppercase">
                      {orderCount} {orderCount === 1 ? 'Pedido' : 'Pedidos'}
                    </Text>
                  </View>
                </View>

                {/* Info e Links de Contato Rápido */}
                <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-monday-darkGridBorder/40">
                  <View className="flex-1 space-y-1">
                    <Text className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Contato</Text>
                    <Text className="text-gray-300 text-xs">{c.phone}</Text>
                    <Text className="text-gray-400 text-[10px]">{c.email}</Text>
                  </View>

                  {/* Ações de Comunicação */}
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleCall(c.phone)}
                      activeOpacity={0.8}
                      className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 mr-2"
                    >
                      <Lucide.Phone size={14} className="text-blue-400" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleWhatsApp(c.phone, c.name)}
                      activeOpacity={0.8}
                      className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
                    >
                      <Lucide.MessageSquareCode size={14} className="text-emerald-400" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>

      {/* Modal Adicionar Cliente */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-monday-darkBg border-t border-monday-darkGridBorder/80 rounded-t-[32px] p-6 max-h-[80%]">
            
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-lg font-black">Registrar Cliente CRM</Text>
              <TouchableOpacity 
                onPress={() => setShowModal(false)}
                className="p-1 rounded-full bg-white/10"
              >
                <Lucide.X size={18} className="text-gray-300" />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-4" showsVerticalScrollIndicator={false}>
              
              {/* Nome */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nome Completo *</Text>
                <TextInput
                  placeholder="Ex: Arthur Pendragon"
                  placeholderTextColor="#6b7280"
                  value={name}
                  onChangeText={setName}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Contato */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Telefone (DDD) *</Text>
                  <TextInput
                    placeholder="Ex: (11) 98765-4321"
                    placeholderTextColor="#6b7280"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">E-mail *</Text>
                  <TextInput
                    placeholder="Ex: arthur@email.com"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                  />
                </View>
              </View>

              {/* Endereço */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Endereço de Entrega *</Text>
                <TextInput
                  placeholder="Ex: Av. das Nações Unidas, 12000"
                  placeholderTextColor="#6b7280"
                  value={address}
                  onChangeText={setAddress}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Cidade */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cidade - UF *</Text>
                <TextInput
                  placeholder="Ex: São Paulo - SP"
                  placeholderTextColor="#6b7280"
                  value={city}
                  onChangeText={setCity}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Botão de Criação */}
              <TouchableOpacity
                onPress={handleAddCustomer}
                activeOpacity={0.8}
                className="bg-brand-500 py-4 rounded-2xl items-center border border-brand-400/20 mt-4 mb-10"
              >
                <Text className="text-white font-extrabold text-sm uppercase tracking-wider">Registrar Cliente</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}
