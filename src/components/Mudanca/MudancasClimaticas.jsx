import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "./Mudancas.scss"

Chart.register(LinearScale, TimeScale);

const MudancasClimaticas = ({ cidade, unidade, anoInicio }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!cidade || !chartRef.current) return;

    // Simulação de dados climáticos (substitua por sua API real)
    const gerarDadosClimaticos = () => {
      const dados = [];
      const hoje = new Date();
      const inicio = subYears(hoje, 10);
      
      for (let dt = new Date(inicio); dt <= hoje; dt.setMonth(dt.getMonth() + 1)) {
        const baseTemp = unidade === 'celsius' ? 
          (Math.random() * 15 + 10) : 
          (Math.random() * 27 + 50);
        
        // Tendência de aquecimento simulada
        const aquecimento = ((dt - inicio) / (hoje - inicio)) * 3;
        
        dados.push({
          date: new Date(dt),
          temperature: baseTemp + aquecimento + (Math.random() * 2 - 1),
          precipitation: Math.random() * 100
        });
      }
      return dados;
    };

    const dados = gerarDadosClimaticos();
    const ctx = chartRef.current.getContext('2d');

    // Destruir instância anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: `Temperatura (°${unidade === 'celsius' ? 'C' : 'F'})`,
            data: dados.map(item => ({
              x: item.date,
              y: item.temperature
            })),
            borderColor: 'rgba(255, 126, 95, 1)',
            backgroundColor: 'rgba(255, 126, 95, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            yAxisID: 'y',
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(255, 126, 95, 1)'
          },
          {
            label: 'Precipitação (mm)',
            data: dados.map(item => ({
              x: item.date,
              y: item.precipitation
            })),
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            yAxisID: 'y1',
            pointRadius: 0,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'year',
              tooltipFormat: 'MMMM yyyy',
              displayFormats: {
                year: 'yyyy'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              maxRotation: 0,
              autoSkip: true
            },
            adapters: {
              date: {
                locale: ptBR
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: `Temperatura (°${unidade === 'celsius' ? 'C' : 'F'})`,
              color: 'rgba(255, 126, 95, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(255, 126, 95, 0.8)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Precipitação (mm)',
              color: 'rgba(102, 126, 234, 0.8)'
            },
            grid: {
              drawOnChartArea: false,
              drawBorder: false
            },
            ticks: {
              color: 'rgba(102, 126, 234, 0.8)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              padding: 20,
              font: {
                size: 14
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 30, 30, 0.95)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
            callbacks: {
              title: (context) => {
                const date = new Date(context[0].parsed.x);
                return format(date, 'MMMM yyyy', { locale: ptBR });
              },
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(1);
                }
                return label;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [cidade, unidade, anoInicio]);

  return (
    <div className='secao-mudancas'>
         <div className="mudancas-climaticas">
      <h2>Mudanças Climáticas nos Últimos 10 Anos</h2>
      <p>
        Tendência de temperatura e precipitação em {cidade?.nome} de {anoInicio} até {anoInicio + 10}
      </p>
      <div style={{ position: 'relative', height: '400px', width: '100%' }}>
        <canvas ref={chartRef} />
      </div>
    </div>
    </div>
  );
};

export default MudancasClimaticas;