import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useApp } from '../../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function InventoryScreen() {
  const { inventory, adjustInventoryItem, addInventoryItem } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'wood' | 'fabric' | 'foam' | 'hardware'>('all');
  
  // Estados do Modal de Cadastro
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'wood' | 'fabric' | 'foam' | 'hardware' | 'accessory'>('wood');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [minQuantity, setMinQuantity] = useState('');

  const handleAddInventoryItem = () => {
    if (!name || !quantity || !unit || !minQuantity) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    addInventoryItem({
      name,
      category,
      quantity: parseFloat(quantity) || 0,
      unit,
      minQuantity: parseFloat(minQuantity) || 0
    });

    // Reset Form
    setName('');
    setCategory('wood');
    setQuantity('');
    setUnit('');
    setMinQuantity('');
    setShowModal(false);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'wood', label: 'Madeira' },
    { id: 'fabric', label: 'Tecido' },
    { id: 'foam', label: 'Espuma' },
    { id: 'hardware', label: 'Ferragens' }
  ] as const;

  return (
    <View className="flex-1 bg-monday-darkBg">
      
      {/* Filtro e Busca */}
      <View className="p-4 bg-monday-darkBg border-b border-monday-darkGridBorder/50 space-y-3">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3 mr-2">
            <Lucide.Search size={16} className="text-gray-400 mr-2" />
            <TextInput
              placeholder="Pesquisar matéria-prima..."
              placeholderTextColor="#6b7280"
              value={search}
              onChangeText={setSearch}
              className="flex-1 text-white text-xs"
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            className="bg-brand-500 hover:bg-brand-600 p-3.5 rounded-2xl border border-brand-400/20"
          >
            <Lucide.Plus size={16} className="text-white" />
          </TouchableOpacity>
        </View>

        {/* Categorias horizontais */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pt-2">
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl mr-2 border ${
                activeCategory === cat.id 
                  ? 'bg-brand-500 border-brand-400/25' 
                  : 'bg-monday-darkGridBorder/20 border-monday-darkGridBorder/60'
              }`}
            >
              <Text className={`text-xs font-bold ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid Estilo Monday.com */}
      <ScrollView className="flex-1 px-4 pt-4">
        
        {/* Cabeçalho da Tabela */}
        <View className="flex-row px-3 py-2 bg-monday-darkGridBorder/40 rounded-xl mb-3 border border-monday-darkGridBorder/60">
          <Text className="flex-1 text-gray-400 font-bold text-[10px] uppercase tracking-wider">Item / Categoria</Text>
          <Text className="w-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-wider">Qtd</Text>
          <Text className="w-20 text-center text-gray-400 font-bold text-[10px] uppercase tracking-wider">Status</Text>
        </View>

        {filteredInventory.length === 0 ? (
          <View className="items-center justify-center py-20 bg-monday-darkGridBorder/15 border border-dashed border-monday-darkGridBorder/60 rounded-3xl mt-2">
            <Lucide.Boxes size={40} className="text-gray-600 mb-2" />
            <Text className="text-gray-400 text-xs font-bold">Nenhum insumo encontrado</Text>
          </View>
        ) : (
          filteredInventory.map(item => {
            const isCritical = item.status === 'critical';
            
            return (
              <View 
                key={item.id} 
                className="flex-row items-center bg-monday-darkGridBorder/15 border border-monday-darkGridBorder/60 rounded-2xl p-3.5 mb-3"
              >
                {/* Nome e Categoria */}
                <View className="flex-1 pr-2">
                  <Text className="text-white font-bold text-xs leading-snug">{item.name}</Text>
                  <Text className="text-gray-500 text-[9px] uppercase font-bold mt-0.5 tracking-wider">{item.category}</Text>
                </View>

                {/* Ajuste de Quantidade Rápido (Operadores) */}
                <View className="flex-row items-center w-24 justify-between bg-black/30 rounded-xl p-1 border border-white/5 mx-2">
                  <TouchableOpacity
                    onPress={() => adjustInventoryItem(item.id, -1)}
                    activeOpacity={0.8}
                    className="w-7 h-7 bg-monday-darkGridBorder/60 rounded-lg justify-center items-center"
                  >
                    <Lucide.Minus size={12} className="text-white" />
                  </TouchableOpacity>

                  <Text className="text-white font-black text-xs text-center flex-1">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => adjustInventoryItem(item.id, 1)}
                    activeOpacity={0.8}
                    className="w-7 h-7 bg-brand-500/20 rounded-lg justify-center items-center border border-brand-500/30"
                  >
                    <Lucide.Plus size={12} className="text-brand-300" />
                  </TouchableOpacity>
                </View>

                {/* Badge de Alerta estilo Monday.com */}
                <View className="w-18 items-end">
                  <View className={`px-2.5 py-1.5 rounded-lg border ${
                    isCritical 
                      ? 'bg-rose-500/10 border-rose-500/30' 
                      : 'bg-emerald-500/10 border-emerald-500/30'
                  }`}>
                    <Text className={`text-[9px] font-black uppercase tracking-wider text-center ${
                      isCritical ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {isCritical ? 'CRÍTICO' : 'OK'}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-[8px] mt-1 mr-1">
                    Mín: {item.minQuantity} {item.unit}
                  </Text>
                </View>

              </View>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>

      {/* Modal de Cadastro de Matéria-Prima */}
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
              <Text className="text-white text-lg font-black">Cadastrar Matéria-Prima</Text>
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
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nome do Insumo *</Text>
                <TextInput
                  placeholder="Ex: Tecido Veludo Real Vermelho"
                  placeholderTextColor="#6b7280"
                  value={name}
                  onChangeText={setName}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Categoria */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Categoria *</Text>
                <View className="flex-wrap flex-row gap-2 bg-black/40 border border-white/10 p-2 rounded-2xl">
                  {([
                    { id: 'wood', label: 'Madeira' },
                    { id: 'fabric', label: 'Tecido' },
                    { id: 'foam', label: 'Espuma' },
                    { id: 'hardware', label: 'Ferragens' },
                    { id: 'accessory', label: 'Acessórios' }
                  ] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl border ${category === cat.id ? 'bg-brand-500 border-brand-400/20' : 'bg-transparent border-white/5'}`}
                    >
                      <Text className={`font-bold text-[11px] ${category === cat.id ? 'text-white' : 'text-gray-400'}`}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantidade Inicial & Unidade */}
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Qtd Inicial *</Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Ex: 50"
                    placeholderTextColor="#6b7280"
                    value={quantity}
                    onChangeText={setQuantity}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Unidade *</Text>
                  <TextInput
                    placeholder="Ex: m, placas, un"
                    placeholderTextColor="#6b7280"
                    value={unit}
                    onChangeText={setUnit}
                    className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                  />
                </View>
              </View>

              {/* Nível Crítico */}
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Estoque de Alerta Mínimo *</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Ex: 15"
                  placeholderTextColor="#6b7280"
                  value={minQuantity}
                  onChangeText={setMinQuantity}
                  className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-xs"
                />
              </View>

              {/* Botão Salvar */}
              <TouchableOpacity
                onPress={handleAddInventoryItem}
                activeOpacity={0.8}
                className="bg-brand-500 py-4 rounded-2xl items-center border border-brand-400/20 mt-4 mb-10"
              >
                <Text className="text-white font-extrabold text-sm uppercase tracking-wider">Adicionar ao Estoque</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}
