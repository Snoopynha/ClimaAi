import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './MudancasClimaticas.css';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function MudancasClimaticas({ cidade, unidade, anoInicio }) {
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (!cidade) return;

        const anoAtual = new Date().getFullYear();

        const carregarHistorico = async () => {
            setCarregando(true);
            const promessas = [];
            
            for (let ano = anoInicio; ano <= anoAtual; ano++) {
                const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${cidade.latitude}&longitude=${cidade.longitude}&start_date=${ano}-01-01&end_date=${ano}-12-31&temperature_unit=${unidade}&daily=temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo`;
                promessas.push(fetch(url).then((resp) => resp.json()));
            }

            const respostas = await Promise.all(promessas);

            const dadosAnuais = respostas.map((json, i) => {
            const max = json?.daily?.temperature_2m_max;
            const min = json?.daily?.temperature_2m_min;
            if (!max || !min) return null;

            const mediaMax = max.reduce((a, b) => a + b, 0) / max.length;
            const mediaMin = min.reduce((a, b) => a + b, 0) / min.length;

            return {
                ano: anoInicio + i,
                mediaMax: parseFloat(mediaMax.toFixed(1)),
                mediaMin: parseFloat(mediaMin.toFixed(1)),
            };
        }).filter(Boolean);

      setDados(dadosAnuais);
      setCarregando(false);
    };

    carregarHistorico();
  }, [cidade, unidade, anoInicio]);

  const chartData = {
    labels: dados.map((d) => d.ano),
    datasets: [
      {
        label: `Temp. Máx. Média (°${unidade === 'celsius' ? 'C' : unidade === 'fahrenheit' ? 'F' : 'K'})`,
        data: dados.map((d) => d.mediaMax),
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
        tension: 0.3,
        fill: false,
      },
      {
        label: `Temp. Mín. Média (°${unidade === 'celsius' ? 'C' : unidade === 'fahrenheit' ? 'F' : 'K'})`,
        data: dados.map((d) => d.mediaMin),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.1)',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  return (
    <div className="mudancas-climaticas">
      <h2>Mudanças Climáticas em {cidade?.nome}</h2>
      {carregando ? (
        <p>Carregando dados históricos...</p>
      ) : dados.length > 0 ? (
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
      ) : (
        <p>Sem dados históricos disponíveis.</p>
      )}
    </div>
  );
}

export default MudancasClimaticas;