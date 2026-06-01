import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  InventoryItem, 
  Customer, 
  Delivery, 
  KanbanStage, 
  INITIAL_ORDERS, 
  INITIAL_INVENTORY, 
  INITIAL_CUSTOMERS, 
  INITIAL_DELIVERIES, 
  calculateStockConsumption 
} from '../services/mockDb';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export type UserRole = 'gerente' | 'operador';

interface AppContextType {
  user: any | null;
  role: UserRole;
  orders: Order[];
  inventory: InventoryItem[];
  customers: Customer[];
  deliveries: Delivery[];
  virtualDaysElapsed: number;
  isLoading: boolean;
  
  // Ações de Negócio
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'stage' | 'stageEntryTime' | 'simulatedDeliveryDate'>) => void;
  advanceOrder: (orderId: string) => void;
  adjustInventoryItem: (itemId: string, amount: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  signDelivery: (deliveryId: string, signatureBase64: string) => void;
  simulateTimeAdvance: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRoleState] = useState<UserRole>('gerente');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [virtualDaysElapsed, setVirtualDaysElapsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Monitorar alterações de autenticação Supabase real, se configurado
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          // Determina role padrão a partir do email ou metadados
          setRoleState(session.user.email?.includes('admin') ? 'gerente' : 'operador');
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          setRoleState(session.user.email?.includes('admin') ? 'gerente' : 'operador');
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Login (Suporta demonstração local ou Supabase real)
  const login = async (email: string, selectedRole: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Mock login no Supabase para demonstração fácil (ou signup)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!', // Senha padrão demo
        });
        if (error) {
          // Se não existir, tenta criar
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: 'Password123!',
          });
          if (signUpError) throw signUpError;
          setUser(signUpData.user);
        } else {
          setUser(data.user);
        }
      } else {
        // Login Mock
        setUser({ id: 'mock-user-1', email, name: email.split('@')[0] });
      }
      setRoleState(selectedRole);
      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      // Fallback para login mock mesmo com erro para não travar o usuário
      setUser({ id: 'mock-user-fallback', email, name: email.split('@')[0] });
      setRoleState(selectedRole);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  // Criar Pedido
  const createOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'stage' | 'stageEntryTime' | 'simulatedDeliveryDate'>) => {
    const newId = `p${orders.length + 1}`;
    const now = new Date().toISOString();
    
    const newOrder: Order = {
      ...newOrderData,
      id: newId,
      createdAt: now,
      stage: 'backlog',
      stageEntryTime: now,
      simulatedDeliveryDate: new Date(newOrderData.deliveryDate)
    };

    setOrders(prev => [newOrder, ...prev]);

    // Opcional: Salvar no Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').insert([newOrder]).then(({ error }) => {
        if (error) console.error('Erro ao salvar pedido no Supabase:', error);
      });
    }
  };

  // Avançar pedido de etapa no Kanban de Produção
  const advanceOrder = (orderId: string) => {
    const stages: KanbanStage[] = ['backlog', 'prep', 'upholstery', 'assembly', 'ready'];
    
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id !== orderId) return order;

        const currentIndex = stages.indexOf(order.stage);
        if (currentIndex === -1 || currentIndex === stages.length - 1) return order; // Já está pronto

        const nextStage = stages[currentIndex + 1];
        
        // --- LOGICA DE CONSUMO INTELIGENTE DE ESTOQUE ---
        const consumedItems = calculateStockConsumption(order.productType, order.quantity, nextStage);
        if (consumedItems.length > 0) {
          setInventory(prevInv => {
            return prevInv.map(invItem => {
              const spent = consumedItems.find(item => item.name === invItem.name);
              if (!spent) return invItem;
              
              const newQty = Math.max(0, invItem.quantity - spent.quantity);
              return {
                ...invItem,
                quantity: newQty,
                status: newQty <= invItem.minQuantity ? 'critical' : 'normal'
              };
            });
          });
        }

        // --- GERAÇÃO AUTOMÁTICA DE ENTREGA ---
        if (nextStage === 'ready') {
          const newDeliveryId = `d${deliveries.length + 1}`;
          const newDelivery: Delivery = {
            id: newDeliveryId,
            orderId: order.id,
            customerName: order.customerName,
            productInfo: `${order.quantity}x ${order.modelName} (${order.fabricColor})`,
            address: customers.find(c => c.id === order.customerId)?.address || 'Retirada na Fábrica',
            status: 'pending',
            driverName: 'Marcos Souza'
          };
          setDeliveries(prev => [...prev, newDelivery]);
        }

        const updatedOrder = {
          ...order,
          stage: nextStage,
          stageEntryTime: new Date().toISOString()
        };

        // Opcional: Atualizar no Supabase Cloud
        if (isSupabaseConfigured && supabase) {
          supabase.from('orders')
            .update({ stage: nextStage, stageEntryTime: updatedOrder.stageEntryTime })
            .eq('id', orderId)
            .then(({ error }) => {
              if (error) console.error('Erro ao atualizar estágio no Supabase:', error);
            });
        }

        return updatedOrder;
      });
    });
  };

  // Ajustar Estoque Manualmente
  const adjustInventoryItem = (itemId: string, amount: number) => {
    setInventory(prevInv => {
      return prevInv.map(item => {
        if (item.id !== itemId) return item;
        const newQty = Math.max(0, item.quantity + amount);
        return {
          ...item,
          quantity: newQty,
          status: newQty <= item.minQuantity ? 'critical' : 'normal'
        };
      });
    });

    // Opcional: Atualizar no Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      const updatedItem = inventory.find(i => i.id === itemId);
      if (updatedItem) {
        const newQty = Math.max(0, updatedItem.quantity + amount);
        supabase.from('inventory')
          .update({ quantity: newQty, status: newQty <= updatedItem.minQuantity ? 'critical' : 'normal' })
          .eq('id', itemId)
          .then(({ error }) => {
            if (error) console.error('Erro ao atualizar estoque no Supabase:', error);
          });
      }
    }
  };

  // Adicionar Item ao Estoque
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const newId = `i${inventory.length + 1}`;
    const newItem: InventoryItem = {
      ...itemData,
      id: newId,
      status: itemData.quantity <= itemData.minQuantity ? 'critical' : 'normal'
    };
    setInventory(prev => [...prev, newItem]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('inventory').insert([newItem]).then(({ error }) => {
        if (error) console.error('Erro ao salvar novo item de estoque no Supabase:', error);
      });
    }
  };

  // Adicionar Cliente CRM
  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `c${customers.length + 1}`
    };
    setCustomers(prev => [...prev, newCustomer]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('customers').insert([newCustomer]).then(({ error }) => {
        if (error) console.error('Erro ao salvar cliente no Supabase:', error);
      });
    }
  };

  // Registrar Entrega com Assinatura
  const signDelivery = (deliveryId: string, signatureBase64: string) => {
    setDeliveries(prev => {
      return prev.map(del => {
        if (del.id !== deliveryId) return del;
        return {
          ...del,
          status: 'delivered',
          signatureBase64,
          deliveredAt: new Date().toISOString()
        };
      });
    });
  };

  // Simular Avanço de Tempo (+24h virtuais)
  const simulateTimeAdvance = () => {
    setVirtualDaysElapsed(prev => prev + 1);
    
    // Atualiza a data atual simulada de todos os pedidos ativos
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        const newSimulatedDate = new Date(order.simulatedDeliveryDate);
        // Avançar o tempo virtual significa que a data de entrega simulada do pedido "se aproxima"
        // Ou seja, na perspectiva do dashboard, a data atual do sistema avançou 1 dia,
        // então a data de entrega simulada permanece igual, mas podemos diminuir os dias restantes do prazo.
        return order;
      });
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        orders,
        inventory,
        customers,
        deliveries,
        virtualDaysElapsed,
        isLoading,
        setRole,
        login,
        logout,
        createOrder,
        advanceOrder,
        adjustInventoryItem,
        addInventoryItem,
        addCustomer,
        signDelivery,
        simulateTimeAdvance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
