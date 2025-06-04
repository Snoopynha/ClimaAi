import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaSun, FaMoon, FaCloud, FaCloudSun, FaCloudMoon, FaCloudRain, FaSnowflake, FaBolt, FaSmog } from 'react-icons/fa';
import "./ClimaAtual.scss"

function ClimaAtual({ cidade, unidade }) {
    const [clima, setClima] = useState(null);
    const [momento, setMomento] = useState('-');

    useEffect(() => {
        if (!cidade) return;

        const obterClima = async () => {
            try {
                const resposta = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index&temperature_unit=${unidade === 'fahrenheit' ? 'fahrenheit' : 'celsius'}&timezone=auto`
                );
                const dados = await resposta.json();

                if (dados && dados.current && 'weathercode' in dados.current) {
                    setClima(dados.current);

                    const horaCidade = new Date(dados.current.time).getHours();
                    if (horaCidade >= 5 && horaCidade < 12) {
                        setMomento('Manhã');
                    } else if (horaCidade >= 12 && horaCidade < 18) {
                        setMomento('Tarde');
                    } else {
                        setMomento('Noite');
                    }
                } else {
                    setClima(null);
                    console.warn('Dados de clima não encontrados:', dados);
                }
            } catch (error) {
                console.error('Erro ao obter dados:', error);
                setClima(null);
            }
        };

        obterClima();
    }, [cidade, unidade]);

    const weatherCodeMap = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Névoa',
        48: 'Névoa com geada',
        51: 'Garoa leve',
        53: 'Garoa moderada',
        55: 'Garoa densa',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve intensa',
        80: 'Aguaceiros leves',
        81: 'Aguaceiros moderados',
        82: 'Aguaceiros violentos',
        95: 'Trovoadas',
        96: 'Trovoadas com granizo leve',
        99: 'Trovoadas com granizo forte'
    };

    const getWeatherIcon = (weathercode, momento) => {
        const isDay = momento === 'Dia';
        
        switch(true) {
            case weathercode === 0:
                return isDay ? <FaSun className="icone-clima" /> : <FaMoon className="icone-clima" />;
            case weathercode === 1 || weathercode === 2:
                return isDay ? <FaCloudSun className="icone-clima" /> : <FaCloudMoon className="icone-clima" />;
            case weathercode === 3:
                return <FaCloud className="icone-clima" />;
            case weathercode >= 51 && weathercode <= 55:
                return <FaCloudRain className="icone-clima" />;
            case weathercode >= 61 && weathercode <= 65:
                return <FaCloudRain className="icone-clima" />;
            case weathercode >= 71 && weathercode <= 75:
                return <FaSnowflake className="icone-clima" />;
            case weathercode >= 80 && weathercode <= 82:
                return <FaCloudRain className="icone-clima" />;
            case weathercode >= 95 && weathercode <= 99:
                return <FaBolt className="icone-clima" />;
            case weathercode === 45 || weathercode === 48:
                return <FaSmog className="icone-clima" />;
            default:
                return isDay ? <FaSun className="icone-clima" /> : <FaMoon className="icone-clima" />;
        }
    };

    const temp = clima?.temperature_2m ?? '—';
    const descricao = clima ? weatherCodeMap[clima.weathercode] ?? 'Desconhecido' : '—';
    const nome = cidade?.nome ?? '—';
    const pais = cidade?.pais ?? '—';

    return (
        <div className="cartao-clima">
            <div className="cabecalho-clima">
                <h2>Temperatura</h2>
                <span className="etiqueta-tempo">{momento}</span>
            </div>
            
            <div className="conteudo-clima">
                <div className="principal-clima">
                    {clima && getWeatherIcon(clima.weathercode, momento)}
                    <div className="exibicao-temperatura">
                        <span className="valor-temperatura">{temp}</span>
                        <span className="unidade-temperatura">
                            °{unidade === 'celsius' ? 'C' : 'F'}
                        </span>
                    </div>
                    <div className="descricao-clima">{descricao}</div>
                </div>
                
                <div className="info-localizacao">
                    <div className="marcador-local">
                        <FaMapMarkerAlt className="icone-localizacao" />
                    </div>
                    <div>
                        <h3 className="nome-cidade">{nome}</h3>
                        <p className="nome-pais">{pais}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClimaAtual;