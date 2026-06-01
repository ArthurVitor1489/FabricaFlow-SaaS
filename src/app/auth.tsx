import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useApp, UserRole } from '../context/AppContext';
import * as Lucide from 'lucide-react-native';

export default function AuthScreen() {
  const { login, isLoading } = useApp();
  const [email, setEmail] = useState('gerente@fabricaflow.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('gerente');

  const handleLogin = async () => {
    if (!email) return;
    await login(email, selectedRole);
  };

  const selectDemoRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'gerente') {
      setEmail('gerente@fabricaflow.com');
    } else {
      setEmail('operador@fabricaflow.com');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-monday-darkBg"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          
          {/* Logo e Branding */}
          <View className="items-center mb-10">
            <View className="bg-brand-500 p-4 rounded-3xl mb-4 border border-brand-400/30" style={{ elevation: 5 }}>
              <Lucide.Factory size={36} fill="white" className="text-white" />
            </View>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              Fabrica<Text className="text-brand-400">Flow</Text>
            </Text>
            <Text className="text-gray-400 text-xs mt-1.5 uppercase tracking-widest font-semibold">
              Gestão Inteligente de Estofados
            </Text>
          </View>

          {/* Painel de Login (Glassmorphism Mock) */}
          <View className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/65 p-6 rounded-3xl mb-6">
            <Text className="text-white text-lg font-bold mb-5">Conectar à Fábrica</Text>
            
            {/* Campo Email */}
            <View className="mb-4">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">E-mail Corporativo</Text>
              <View className="flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus:border-brand-500">
                <Lucide.Mail size={18} className="text-gray-400 mr-2.5" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="exemplo@fabricaflow.com"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-sm"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View className="mb-6">
              <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Senha de Acesso</Text>
              <View className="flex-row items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus:border-brand-500">
                <Lucide.Lock size={18} className="text-gray-400 mr-2.5" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Digite sua senha"
                  placeholderTextColor="#6b7280"
                  className="flex-1 text-white text-sm"
                />
              </View>
            </View>

            {/* Seletor de Perfil de Demonstração */}
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Perfil de Acesso</Text>
            <View className="flex-row bg-black/40 border border-white/10 p-1 rounded-2xl mb-6">
              <TouchableOpacity
                onPress={() => selectDemoRole('gerente')}
                activeOpacity={0.8}
                className={`flex-1 flex-row justify-center items-center py-3 rounded-xl ${selectedRole === 'gerente' ? 'bg-brand-500' : 'bg-transparent'}`}
              >
                <Lucide.Briefcase size={16} className={`mr-1.5 ${selectedRole === 'gerente' ? 'text-white' : 'text-gray-400'}`} />
                <Text className={`font-bold text-xs ${selectedRole === 'gerente' ? 'text-white' : 'text-gray-400'}`}>
                  Gerente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => selectDemoRole('operador')}
                activeOpacity={0.8}
                className={`flex-1 flex-row justify-center items-center py-3 rounded-xl ${selectedRole === 'operador' ? 'bg-brand-500' : 'bg-transparent'}`}
              >
                <Lucide.Hammer size={16} className={`mr-1.5 ${selectedRole === 'operador' ? 'text-white' : 'text-gray-400'}`} />
                <Text className={`font-bold text-xs ${selectedRole === 'operador' ? 'text-white' : 'text-gray-400'}`}>
                  Operador
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
              className="bg-brand-500 py-4 rounded-2xl items-center border border-brand-400/25 mb-4"
              style={{
                shadowColor: '#8b5cf6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-sm uppercase tracking-wider">
                  Entrar no Sistema
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogin}
              className="items-center"
            >
              <Text className="text-brand-300 text-xs font-semibold">
                Utilizar Modo Demonstração (Offline)
              </Text>
            </TouchableOpacity>

          </View>

          {/* Dica do sistema */}
          <View className="flex-row items-center justify-center space-x-2">
            <Lucide.ShieldCheck size={14} className="text-emerald-400" />
            <Text className="text-gray-500 text-xs text-center ml-1">
              Conexão Supabase SSL Habilitada
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
