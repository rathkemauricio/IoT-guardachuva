const ESP32_IP = 'http://10.219.4.8'; // Troque pelo IP do seu ESP32

export async function abrirGuardaChuva() {
    try {
        const res = await fetch(`${ESP32_IP}/abrir`);
        if (!res.ok) throw new Error('Falha ao abrir');
        return await res.text();
    } catch (e) {
        return 'Erro ao conectar ao ESP32';
    }
}

export async function fecharGuardaChuva() {
    try {
        const res = await fetch(`${ESP32_IP}/fechar`);
        if (!res.ok) throw new Error('Falha ao fechar');
        return await res.text();
    } catch (e) {
        return 'Erro ao conectar ao ESP32';
    }
} 