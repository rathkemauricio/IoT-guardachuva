import axios from 'axios';

export async function abrirGuardaChuva(ip: string) {
    await axios.get(`http://${ip}/abrir`);
}

export async function fecharGuardaChuva(ip: string) {
    await axios.get(`http://${ip}/fechar`);
}

export async function getStatus(ip: string): Promise<'Aberto' | 'Fechado' | 'Erro'> {
    try {
        const res = await axios.get(`http://${ip}/status`);
        return res.data.status === 'aberto' ? 'Aberto' : 'Fechado';
    } catch {
        return 'Erro';
    }
}

export async function getPrevisao(ip: string): Promise<{ clima: string; descricao: string; temperatura: number } | null> {
    try {
        const res = await axios.get(`http://${ip}/previsao`);
        return res.data;
    } catch {
        return null;
    }
}

// Previsão do tempo via OpenWeatherMap (cidade fixa)
const OPENWEATHER_API_KEY = 'b4497912b3e27203c22692d2287649e2'
; // Substitua por sua chave da OpenWeatherMap
const OPENWEATHER_CITY = 'Santa Cruz do Sul';
const OPENWEATHER_LANG = 'pt_br';
const OPENWEATHER_UNITS = 'metric';

export async function getPrevisaoApp(): Promise<{ clima: string; descricao: string; temperatura: number } | null> {
    try {
        const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${OPENWEATHER_CITY}&appid=${OPENWEATHER_API_KEY}&lang=${OPENWEATHER_LANG}&units=${OPENWEATHER_UNITS}`
        );
        return {
            clima: res.data.weather[0].main,
            descricao: res.data.weather[0].description,
            temperatura: res.data.main.temp,
        };
    } catch {
        return null;
    }
} 