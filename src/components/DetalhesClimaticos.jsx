import React, { useEffect, useState } from 'react';
import './DetalhesClimaticos.css';

function DetalhesClimaticos({ cidade, unidade }) {
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    if (!cidade) {
      setDetalhes(null);
      return;
    }

    const obterDetalhes = async () => {
      const resposta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current=apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index&temperature_unit=${unidade === 'celsius' ? 'celsius' : unidade}&timezone=America/Sao_Paulo`);
      const dados = await resposta.json();
      setDetalhes(dados.current);
    };

    obterDetalhes();
  }, [cidade, unidade]);

  const sensacao = detalhes?.apparent_temperature ?? '—';
  const umidade = detalhes?.relative_humidity_2m ?? '—';
  const vento = detalhes?.wind_speed_10m ?? '—';
  const uv = detalhes?.uv_index ?? '—';

  return (
    <div className="detalhes-climaticos">
      <div className="detalhe">
        <span>Sensação Térmica</span>
        <span>{sensacao}°{unidade === 'celsius' ? 'C' : unidade === 'fahrenheit' ? 'F' : 'K'}</span>
      </div>
      <div className="detalhe">
        <span>Umidade</span>
        <span>{umidade}%</span>
      </div>
      <div className="detalhe">
        <span>Vento</span>
        <span>{vento} km/h</span>
      </div>
      <div className="detalhe">
        <span>Índice UV</span>
        <span>{uv}</span>
      </div>
    </div>
  );
}

export default DetalhesClimaticos;