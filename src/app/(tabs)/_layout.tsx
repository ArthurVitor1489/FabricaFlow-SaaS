import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function TabsLayout() {
  const { role, setRole, logout } = useApp();

  const handleRoleToggle = () => {
    setRole(role === 'gerente' ? 'operador' : 'gerente');
  };

  const isOperator = role === 'operador';

  // Custom Header com interruptor de perfil
  const renderHeader = (title: string) => {
    return {
      headerShown: true,
      headerStyle: {
        backgroundColor: '#0b0c10',
        borderBottomWidth: 1,
        borderBottomColor: '#292c35',
        elevation: 0,
        shadowOpacity: 0
      },
      headerTitle: () => (
        <View className="flex-row items-center">
          <Lucide.Factory size={18} className="text-brand-400 mr-2" />
          <Text className="text-white font-black text-base">{title}</Text>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row items-center pr-4 space-x-2">
          {/* Toggle de Função para Demonstração */}
          <TouchableOpacity
            onPress={handleRoleToggle}
            activeOpacity={0.8}
            className={`flex-row items-center px-2.5 py-1.5 rounded-xl border ${
              isOperator 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-brand-500/10 border-brand-500/30'
            } mr-2`}
          >
            {isOperator ? (
              <Lucide.Hammer size={12} className="text-amber-400 mr-1.5" />
            ) : (
              <Lucide.Briefcase size={12} className="text-brand-400 mr-1.5" />
            )}
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${isOperator ? 'text-amber-400' : 'text-brand-400'}`}>
              {isOperator ? 'Operador' : 'Gerente'}
            </Text>
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.8}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25"
          >
            <Lucide.LogOut size={14} className="text-rose-400" />
          </TouchableOpacity>
        </View>
      )
    };
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0b0c10',
          borderTopWidth: 1,
          borderTopColor: '#292c35',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#8f95b2',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        }
      }}
    >
      {/* 1. Dashboard Executivo */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          href: isOperator ? null : '/(tabs)', // Oculta aba para Operador
          ...renderHeader('FabricaFlow'),
          tabBarIcon: ({ color, size }) => <Lucide.LayoutDashboard size={size} color={color} />
        }}
      />

      {/* 2. Kanban de Produção */}
      <Tabs.Screen
        name="kanban"
        options={{
          title: 'Produção',
          ...renderHeader('Kanban de Produção'),
          tabBarIcon: ({ color, size }) => <Lucide.Trello size={size} color={color} />
        }}
      />

      {/* 3. Gestão de Pedidos */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          href: isOperator ? null : '/(tabs)/orders', // Oculta aba para Operador
          ...renderHeader('Gestão de Pedidos'),
          tabBarIcon: ({ color, size }) => <Lucide.FileSpreadsheet size={size} color={color} />
        }}
      />

      {/* 4. Controle de Estoque */}
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Estoque',
          ...renderHeader('Controle de Insumos'),
          tabBarIcon: ({ color, size }) => <Lucide.Boxes size={size} color={color} />
        }}
      />

      {/* 5. Acompanhamento de Entregas */}
      <Tabs.Screen
        name="delivery"
        options={{
          title: 'Entregas',
          href: isOperator ? null : '/(tabs)/delivery', // Oculta aba para Operador
          ...renderHeader('Status de Logística'),
          tabBarIcon: ({ color, size }) => <Lucide.Truck size={size} color={color} />
        }}
      />

      {/* 6. Gestão de Clientes */}
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Clientes',
          href: isOperator ? null : '/(tabs)/customers', // Oculta aba para Operador
          ...renderHeader('CRM Clientes'),
          tabBarIcon: ({ color, size }) => <Lucide.Users size={size} color={color} />
        }}
      />
    </Tabs>
  );
}
