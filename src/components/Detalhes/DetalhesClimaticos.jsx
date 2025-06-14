import React, { useEffect, useState } from 'react';
import { 
  FaTemperatureHigh, 
  FaTint, 
  FaWind, 
  FaSun 
} from 'react-icons/fa';
import "./DetalhesClima.scss";


function DetalhesClimaticos({ cidade, unidade }) {
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    if (!cidade) {
      setDetalhes(null);
      return;
    }

    const obterDetalhes = async () => {
      try {
        const resposta = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current=apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index&temperature_unit=${unidade === 'fahrenheit' ? 'fahrenheit' : 'celsius'}&timezone=America/Sao_Paulo`
        );
        const dados = await resposta.json();
        setDetalhes(dados.current);
      } catch (error) {
        console.error('Erro ao obter detalhes climáticos:', error);
      }
    };

    obterDetalhes();
  }, [cidade, unidade]);

  const sensacao = detalhes?.apparent_temperature ?? '—';
  const umidade = detalhes?.relative_humidity_2m ?? '—';
  const vento = detalhes?.wind_speed_10m ?? '—';
  const uv = detalhes?.uv_index ?? '—';

  return (
    <div className="cartao-detalhes-clima">
      <div className="item-detalhe">
        <div className="icone-detalhe">
          <FaTemperatureHigh className="icone-temperatura" />
        </div>
        <div className="conteudo-detalhe">
          <span className="rotulo-detalhe">Sensação Térmica</span>
          <span className="valor-detalhe">
            {sensacao}°{unidade === 'celsius' ? 'C' : 'F'}
          </span>
        </div>
      </div>
      
      <div className="item-detalhe">
        <div className="icone-detalhe">
          <FaTint className="icone-umidade" />
        </div>
        <div className="conteudo-detalhe">
          <span className="rotulo-detalhe">Umidade</span>
          <span className="valor-detalhe">{umidade}%</span>
        </div>
      </div>
      
      <div className="item-detalhe">
        <div className="icone-detalhe">
          <FaWind className="icone-vento" />
        </div>
        <div className="conteudo-detalhe">
          <span className="rotulo-detalhe">Vento</span>
          <span className="valor-detalhe">{vento} km/h</span>
        </div>
      </div>
      
      <div className="item-detalhe">
        <div className="icone-detalhe">
          <FaSun className="icone-uv" />
        </div>
        <div className="conteudo-detalhe">
          <span className="rotulo-detalhe">Índice UV</span>
          <span className="valor-detalhe">{uv}</span>
        </div>
      </div>
    </div>
  );
}

export default DetalhesClimaticos;