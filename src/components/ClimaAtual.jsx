import React, { useEffect, useState} from "react";
import './ClimaAtual.css';

function ClimaAtual ({ cidade, unidade }) {
    const [clima, setClima] = useState(null);
    const [momento, setMomento] = useState('-');

    useEffect(() => {
        if (!cidade) return;

        const obterClima = async () => {
            try {
                const resposta = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index&temperature_unit=${unidade === 'celsius' ? 'celsius' : unidade}&timezone=America/Sao_Paulo`
                );
                const dados = await resposta.json();

                if (dados && dados.current  && 'weathercode' in dados.current) {
                    setClima(dados.current);
                } else {
                    setClima(null);
                    console.warn('Dados de clima não encontrados:', dados);
                }
            } catch (error) {
                console.error('Erro ao obter dados:', error);
                setClima(null);
            }
            console.log(clima.weathercode);
        };

        obterClima();

        const agora = new Date();
        const hora = agora.getHours();

        if (hora >= 6 && hora < 18) {
            setMomento('Dia');
        } else {
            setMomento('Noite');
        }
    }, [cidade, unidade]);

    {/*
    const weatherIconMap = {
        0: 'sun.svg',
        1: 'partly_cloudy.svg',
        2: 'cloudy.svg',
        3: 'rain.svg',
        // Adicione outros códigos conforme necessário
    };

    const icone = clima ? `/icons/${weatherIconMap[clima.weathercode]}` : ''; 
    */}

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
    const temp = clima?.temperature_2m ?? '—';
    const icone = clima ? `https://open-meteo.com/images/weather-icons/${clima.weathercode}.svg` : '';
    const descricao = clima ? weatherCodeMap[clima.weathercode] ?? 'Desconhecido' : '—';
    const nome = cidade?.nome ?? '—';
    const pais = cidade?.pais ?? '—';

    return (
        <div className="clima-atual">
            <div className="info-principal">
                {icone && <img src={icone} alt="Ícone clima" />}
                <div className="temperatura">
                    {temp}°
                    {unidade === 'celsius' ? 'C' : unidade === 'fahrenheit' ? 'F' : 'K'}
                </div>
                <div className="descricao">{descricao}</div>
            </div>
            <div className="info-local">
                <span>{nome}, {pais}</span>
                <br />
                <span>{momento}</span>
            </div>
        </div>
    );
}

export default ClimaAtual;