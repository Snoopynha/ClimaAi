import React, { useState } from 'react';
import Navbar from './components/Nav/Navbar';
import ClimaAtual from './components/Atual/ClimaAtual';
import DetalhesClimaticos from './components/Detalhes/DetalhesClimaticos';
import MudancasClimaticas from './components/Mudanca/MudancasClimaticas';
import './components/Variaveis/Variaveis.scss';
import './App.css';

const anoAtual = new Date().getFullYear();
const anoInicio = anoAtual - 10;

function App() {
  const [cidadeTexto, setCidadeTexto] = useState('');
  const [cidade, setCidade] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [unidade, setUnidade] = useState('celsius');

  const buscarClima = async (cidadeSelecionada) => {
    if (!cidadeSelecionada) return;

    setCidade({
      nome: cidadeSelecionada.name,
      pais: cidadeSelecionada.country,
      latitude: cidadeSelecionada.latitude,
      longitude: cidadeSelecionada.longitude,
    });
  };


  return (
    <div className={modoEscuro ? 'app dark' : 'app'}>
      <Navbar
        cidade={cidadeTexto}
        setCidade={setCidadeTexto}
        buscarClima={buscarClima}
        modoEscuro={modoEscuro}
        setModeEscuro={setModoEscuro}
        unidade={unidade}
        alterarUnidade={setUnidade}
      />

      <main style={{ padding: '2rem' }}>
        <div className='flex'>
        <ClimaAtual cidade={cidade} unidade={unidade} />
        <DetalhesClimaticos cidade={cidade} unidade={unidade} />
        </div>
        <MudancasClimaticas cidade={cidade} unidade={unidade} anoInicio={anoInicio} />
      </main>
    </div>
  );
}

export default App;
