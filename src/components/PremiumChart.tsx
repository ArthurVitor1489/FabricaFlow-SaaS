import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { 
  Path, 
  Defs, 
  LinearGradient, 
  Stop, 
  Circle, 
  Rect,
  Text as SvgText,
  G
} from 'react-native-svg';

interface PremiumChartProps {
  data: number[];
  labels: string[];
  height?: number;
  type?: 'line' | 'bar';
}

export const PremiumChart: React.FC<PremiumChartProps> = ({
  data,
  labels,
  height = 180,
  type = 'line'
}) => {
  const screenWidth = Dimensions.get('window').width - 32; // Com padding de 16 de cada lado
  const chartHeight = height;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = screenWidth - paddingLeft - paddingRight;
  const chartDrawableHeight = chartHeight - paddingTop - paddingBottom;

  const maxValue = Math.max(...data, 10) * 1.1; // Margem superior
  const minValue = 0;

  // Gerar pontos (x, y)
  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    const ratio = (val - minValue) / (maxValue - minValue);
    const y = paddingTop + chartDrawableHeight - ratio * chartDrawableHeight;
    return { x, y, value: val };
  });

  // Criar String do Path SVG para o gráfico de linha (curvas quadráticas suaves)
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    // Linha reta ou curva. Faremos curva suave
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    // Fechar o path para preenchimento da área sob o gráfico
    areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartDrawableHeight} L ${points[0].x} ${paddingTop + chartDrawableHeight} Z`;
  }

  // Linhas horizontais de referência
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, idx) => {
    const ratio = idx / (gridLinesCount - 1);
    const y = paddingTop + ratio * chartDrawableHeight;
    const value = Math.round(maxValue - ratio * (maxValue - minValue));
    return { y, value };
  });

  return (
    <View className="bg-monday-darkGridBorder/20 border border-monday-darkGridBorder/60 p-4 rounded-2xl mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-white font-bold text-base">Ritmo de Produção</Text>
          <Text className="text-gray-400 text-xs">Móveis finalizados por dia</Text>
        </View>
        <View className="flex-row items-center bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/30">
          <View className="w-2 h-2 rounded-full bg-brand-500 mr-1.5 animate-pulse" />
          <Text className="text-brand-400 text-[10px] font-bold uppercase tracking-wider">Tempo Real</Text>
        </View>
      </View>

      <View style={{ height }}>
        <Svg width={screenWidth} height={chartHeight}>
          <Defs>
            {/* Gradiente para a área sob a linha */}
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8b5cf6" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#8b5cf6" stopOpacity="0.0" />
            </LinearGradient>
            
            {/* Gradiente para a linha principal */}
            <LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#8b5cf6" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#a78bfa" stopOpacity="1" />
              <Stop offset="1" stopColor="#00c875" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Desenhar Linhas de Grade e Valores do Eixo Y */}
          {gridLines.map((line, idx) => (
            <G key={`grid-${idx}`}>
              <Path 
                d={`M ${paddingLeft} ${line.y} L ${screenWidth - paddingRight} ${line.y}`}
                stroke="#292c35" 
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <SvgText
                x={paddingLeft - 8}
                y={line.y + 4}
                fill="#8f95b2"
                fontSize="10"
                fontWeight="600"
                textAnchor="end"
              >
                {line.value}
              </SvgText>
            </G>
          ))}

          {type === 'line' && points.length > 0 && (
            <>
              {/* Área Sob a Linha */}
              <Path d={areaPath} fill="url(#areaGradient)" />

              {/* Linha do Gráfico */}
              <Path 
                d={linePath} 
                stroke="url(#lineGradient)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Pontos de Destaque */}
              {points.map((p, idx) => (
                <G key={`point-${idx}`}>
                  {/* Círculo de brilho externo no hover simulado para o último ponto */}
                  {idx === points.length - 1 && (
                    <Circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="7" 
                      fill="#00c875" 
                      fillOpacity="0.3" 
                    />
                  )}
                  <Circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    fill={idx === points.length - 1 ? '#00c875' : '#8b5cf6'} 
                    stroke="#0b0c10"
                    strokeWidth="1.5"
                  />
                  {/* Balão com o valor no último nó para visual dinâmico */}
                  {idx === points.length - 1 && (
                    <G>
                      <Rect 
                        x={p.x - 14} 
                        y={p.y - 25} 
                        width="28" 
                        height="18" 
                        rx="5" 
                        fill="#00c875" 
                      />
                      <SvgText
                        x={p.x}
                        y={p.y - 13}
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {p.value}
                      </SvgText>
                    </G>
                  )}
                </G>
              ))}
            </>
          )}

          {type === 'bar' && points.map((p, idx) => {
            const barWidth = Math.min(22, chartWidth / data.length - 8);
            const x = p.x - barWidth / 2;
            const y = p.y;
            const barHeight = paddingTop + chartDrawableHeight - p.y;

            return (
              <G key={`bar-${idx}`}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx="4"
                  fill={idx === points.length - 1 ? '#00c875' : '#8b5cf6'}
                />
                <SvgText
                  x={p.x}
                  y={y - 6}
                  fill="#8f95b2"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {p.value}
                </SvgText>
              </G>
            );
          })}

          {/* Eixo X - Rótulos de Texto */}
          {points.map((p, idx) => (
            <SvgText
              key={`label-${idx}`}
              x={p.x}
              y={chartHeight - 6}
              fill="#8f95b2"
              fontSize="10"
              fontWeight="600"
              textAnchor="middle"
            >
              {labels[idx]}
            </SvgText>
          ))}
        </Svg>
      </View>
    </View>
  );
};
