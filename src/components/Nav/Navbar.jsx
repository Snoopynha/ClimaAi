import React, { useState, useEffect } from 'react';
import { FaSearch, FaSun, FaMoon, FaCog } from 'react-icons/fa';
import LogoCl from '../../assets/LogoModoClaro.png';
import LogoEs from '../../assets/LogoModoEscuro.png';
import './Nav.scss';


function Navbar({ cidade, setCidade, buscarClima, modoEscuro, setModeEscuro, unidade, alterarUnidade}) {
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [sugestoes, setSugestoes] = useState([]);

    useEffect(() => {
        if (!cidade || cidade.trim().length < 1) {
            setSugestoes([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=5`);
                const dados = await resp.json();

                if (dados.results) {
                    setSugestoes(dados.results);
                } else {
                    setSugestoes([]);
                }
            } catch (e) {
                console.error('Erro ao buscar sugestões:', e);
                setSugestoes([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [cidade]);

    const selecionarCidade = (cidadeSelecionada) => {
        setCidade(cidadeSelecionada.name);
        setSugestoes([]);
        buscarClima(cidadeSelecionada);
    };

    const selecionarUnidade = (novaUnidade) => {
        alterarUnidade(novaUnidade);
        setMostrarOpcoes(false);
    };

    return (
       <div className='nav'>
         <nav className={`navbar ${modoEscuro ? 'dark' : ''}`}>
        <div className="esquerda">
            <img src={modoEscuro ? LogoEs : LogoCl} alt="Logo" className="Logo" />
        </div>

        <div className="direita">
            <div className="busca">
                <div className="input-wrapper">
                    <FaSearch className="icone-busca" />
                    <input
                    type="text"
                    placeholder="Buscar cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    />
                    {sugestoes.length > 0 && (
                    <ul className="sugestoes-lista">
                        {sugestoes.map((s) => (
                        <li key={s.id} onClick={() => selecionarCidade(s)}>
                            {s.name}, {s.country}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

            <div className="configuracoes">
            <button onClick={() => setMostrarOpcoes(!mostrarOpcoes)}><FaCog /></button>
            {mostrarOpcoes && (
                <div className="menu-opcoes">
                <button onClick={() => selecionarUnidade('celsius')}>Celsius (°C)</button>
                <button onClick={() => selecionarUnidade('fahrenheit')}>Fahrenheit (°F)</button>
                </div>
            )}
            </div>

            <button className="modo-escuro-btn" id='btn' onClick={() => setModeEscuro(!modoEscuro)}>
            {modoEscuro ? <FaSun /> : <FaMoon />}
            </button>
        </div>
        </nav>
       </div>
    );
}

export default Navbar;
