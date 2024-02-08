import { useState } from 'react'

import './App.css'

import Search from './assets/search.svg'
import axios from "axios"

type Weather = {
  descp: string;
  temp: string;

}

function App() {

    const [weather, setWeather] = useState('');
    const [city, setCity] = useState('');
    const apiKey ='2844d4d1a0b43a667a236ae0e2c40213';

    const apiCall = () => {
     

    }


    return (<>
        <div className="weathhead">
        <h1>Previsão do tempo</h1>
        </div>
        <div className="weather-container">
            <div className="weather">
                <form onSubmit={apiCall} className="input-container">
                    <input type="text" placeholder="Escreva o nome da cidade" name="loc" />
                    <button className="bttn">
                      <img src={Search}/>
                    </button>
                </form>
            </div>
            <div className='capitals-container'>
                <h2>Capitais</h2>
                <div className='capitals-table'>
                    <table>
                        <tr>
                            <th>Min</th>
                            <th>Máx</th>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Rio de Janeiro</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>São Paulo</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Belo Horizonte</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Brasília</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Belém</td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <th>Min</th>
                            <th>Máx</th>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Salvador</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Curitiba</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Fortaleza</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>Manaus</td>
                        </tr>
                        <tr>
                            <td>10</td>
                            <td>25</td>
                            <td>João Pessoa</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        
    </>
    
    )
}

export default App