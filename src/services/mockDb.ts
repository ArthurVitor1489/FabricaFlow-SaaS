// Tipagens e Modelo de Dados do FabricaFlow

export type KanbanStage = 'backlog' | 'prep' | 'upholstery' | 'assembly' | 'ready';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'wood' | 'fabric' | 'foam' | 'hardware' | 'accessory';
  quantity: number;
  unit: string;
  minQuantity: number;
  status: 'normal' | 'critical';
}

export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  productType: 'sofa' | 'chair';
  modelName: string;
  fabricType: string;
  fabricColor: string;
  quantity: number;
  createdAt: string; // ISO string
  deliveryDate: string; // ISO string
  simulatedDeliveryDate: Date; // Usado para simulação de tempo virtual
  stage: KanbanStage;
  priority: 'low' | 'medium' | 'high';
  stageEntryTime: string; // ISO string
  observations?: string;
  totalValue: number;
}

export interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  productInfo: string;
  address: string;
  status: 'pending' | 'transit' | 'delivered';
  driverName: string;
  signatureBase64?: string;
  deliveredAt?: string;
}

// Dados Iniciais Realistas de Fábrica
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Arthur Pendragon',
    phone: '(11) 98765-4321',
    email: 'arthur.king@camelot.com',
    address: 'Av. das Nações Unidas, 12901 - Brooklin',
    city: 'São Paulo - SP'
  },
  {
    id: 'c2',
    name: 'Morgana Le Fay',
    phone: '(21) 99887-7665',
    email: 'morgana@avalon.io',
    address: 'Rua Vieira Souto, 450 - Ipanema',
    city: 'Rio de Janeiro - RJ'
  },
  {
    id: 'c3',
    name: 'Guinevere Silva',
    phone: '(31) 99123-4567',
    email: 'guinevere@gmail.com',
    address: 'Rua Ouro Preto, 88 - Barro Preto',
    city: 'Belo Horizonte - MG'
  },
  {
    id: 'c4',
    name: 'Lancelot Oliveira',
    phone: '(47) 98888-1122',
    email: 'lancelot.valente@yahoo.com.br',
    address: 'Rua XV de Novembro, 1022 - Centro',
    city: 'Blumenau - SC'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Madeira de Eucalipto Tratada', category: 'wood', quantity: 120, unit: 'm', minQuantity: 40, status: 'normal' },
  { id: 'i2', name: 'Tecido Suede Soft Azul', category: 'fabric', quantity: 45, unit: 'm', minQuantity: 15, status: 'normal' },
  { id: 'i3', name: 'Tecido Linho Fino Cinza', category: 'fabric', quantity: 8, unit: 'm', minQuantity: 20, status: 'critical' }, // Crítico
  { id: 'i4', name: 'Espuma D33 Pro Soft', category: 'foam', quantity: 24, unit: 'placas', minQuantity: 8, status: 'normal' },
  { id: 'i5', name: 'Espuma D28 Confort', category: 'foam', quantity: 5, unit: 'placas', minQuantity: 10, status: 'critical' }, // Crítico
  { id: 'i6', name: 'Molas Ensacadas Aço', category: 'hardware', quantity: 180, unit: 'unidades', minQuantity: 50, status: 'normal' },
  { id: 'i7', name: 'Parafusos Zincados 4.5x50', category: 'hardware', quantity: 950, unit: 'unidades', minQuantity: 250, status: 'normal' },
  { id: 'i8', name: 'Pés de Madeira Maciça Cônicos', category: 'accessory', quantity: 12, unit: 'unidades', minQuantity: 24, status: 'critical' } // Crítico
];

// Helper para calcular datas futuras
const getFutureDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'p1',
    customerId: 'c1',
    customerName: 'Arthur Pendragon',
    productType: 'sofa',
    modelName: 'Sofá Retrátil Chesterfield 3p',
    fabricType: 'Suede Soft',
    fabricColor: 'Azul Imperial',
    quantity: 1,
    createdAt: new Date().toISOString(),
    deliveryDate: getFutureDate(4),
    simulatedDeliveryDate: new Date(getFutureDate(4)),
    stage: 'backlog',
    priority: 'high',
    stageEntryTime: new Date().toISOString(),
    observations: 'Cliente muito exigente com o alinhamento das costuras.',
    totalValue: 4800
  },
  {
    id: 'p2',
    customerId: 'c2',
    customerName: 'Morgana Le Fay',
    productType: 'chair',
    modelName: 'Cadeira Gamer Phoenix Pro',
    fabricType: 'Sintético PU',
    fabricColor: 'Preto e Carmim',
    quantity: 2,
    createdAt: getFutureDate(-2),
    deliveryDate: getFutureDate(2),
    simulatedDeliveryDate: new Date(getFutureDate(2)),
    stage: 'prep',
    priority: 'medium',
    stageEntryTime: getFutureDate(-1),
    observations: 'Bordar iniciais MLF no encosto de cabeça.',
    totalValue: 2400
  },
  {
    id: 'p3',
    customerId: 'c3',
    customerName: 'Guinevere Silva',
    productType: 'sofa',
    modelName: 'Sofá Living Premium Itália',
    fabricType: 'Linho Fino',
    fabricColor: 'Cinza Mescla',
    quantity: 1,
    createdAt: getFutureDate(-5),
    deliveryDate: getFutureDate(-1), // Atrasado
    simulatedDeliveryDate: new Date(getFutureDate(-1)),
    stage: 'upholstery',
    priority: 'high',
    stageEntryTime: getFutureDate(-2),
    observations: 'Almofadas soltas decorativas extras incluídas.',
    totalValue: 6200
  },
  {
    id: 'p4',
    customerId: 'c4',
    customerName: 'Lancelot Oliveira',
    productType: 'chair',
    modelName: 'Cadeira de Jantar Milão',
    fabricType: 'Linho Fino',
    fabricColor: 'Creme Rústico',
    quantity: 6,
    createdAt: getFutureDate(-3),
    deliveryDate: getFutureDate(5),
    simulatedDeliveryDate: new Date(getFutureDate(5)),
    stage: 'assembly',
    priority: 'low',
    stageEntryTime: getFutureDate(-1),
    observations: 'Envernizamento dos pés em tom mel.',
    totalValue: 3600
  },
  {
    id: 'p5',
    customerId: 'c1',
    customerName: 'Arthur Pendragon',
    productType: 'sofa',
    modelName: 'Sofá Retrátil Madri',
    fabricType: 'Suede Soft',
    fabricColor: 'Cinza Chumbo',
    quantity: 1,
    createdAt: getFutureDate(-8),
    deliveryDate: getFutureDate(-2),
    simulatedDeliveryDate: new Date(getFutureDate(-2)),
    stage: 'ready',
    priority: 'medium',
    stageEntryTime: getFutureDate(-1),
    totalValue: 3200
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'd1',
    orderId: 'p5',
    customerName: 'Arthur Pendragon',
    productInfo: '1x Sofá Retrátil Madri (Cinza Chumbo)',
    address: 'Av. das Nações Unidas, 12901 - Brooklin - São Paulo - SP',
    status: 'pending',
    driverName: 'Marcos Souza'
  }
];

// Lógica de Consumo Inteligente por Etapa
// Retorna a lista de itens e quantidades consumidas ao entrar em uma determinada etapa
export const calculateStockConsumption = (productType: 'sofa' | 'chair', quantity: number, targetStage: KanbanStage) => {
  const materials: { name: string; quantity: number }[] = [];

  if (productType === 'sofa') {
    if (targetStage === 'prep') {
      // Corte e Estrutura consome madeira
      materials.push({ name: 'Madeira de Eucalipto Tratada', quantity: 15 * quantity });
    } else if (targetStage === 'upholstery') {
      // Tapeçaria consome tecidos, espumas e molas
      materials.push(
        { name: 'Tecido Suede Soft Azul', quantity: 8 * quantity }, // Usando o suede como tecido padrão mock
        { name: 'Espuma D33 Pro Soft', quantity: 3 * quantity },
        { name: 'Molas Ensacadas Aço', quantity: 20 * quantity }
      );
    } else if (targetStage === 'assembly') {
      // Montagem final consome parafusos e pés
      materials.push(
        { name: 'Parafusos Zincados 4.5x50', quantity: 40 * quantity },
        { name: 'Pés de Madeira Maciça Cônicos', quantity: 4 * quantity }
      );
    }
  } else {
    // Cadeira
    if (targetStage === 'prep') {
      materials.push({ name: 'Madeira de Eucalipto Tratada', quantity: 4 * quantity });
    } else if (targetStage === 'upholstery') {
      materials.push(
        { name: 'Tecido Linho Fino Cinza', quantity: 2 * quantity },
        { name: 'Espuma D33 Pro Soft', quantity: 0.5 * quantity }
      );
    } else if (targetStage === 'assembly') {
      materials.push(
        { name: 'Parafusos Zincados 4.5x50', quantity: 12 * quantity },
        { name: 'Pés de Madeira Maciça Cônicos', quantity: 4 * quantity }
      );
    }
  }

  return materials;
};
