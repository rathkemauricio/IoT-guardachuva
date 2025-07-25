import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Title, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ControlScreen() {
    const [ip, setIp] = useState('');
    const [status, setStatus] = useState('Carregando...');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('esp32_ip').then(savedIp => {
            if (savedIp) {
                setIp(savedIp);
                fetchStatus(savedIp);
            }
        });
    }, []);

    const fetchStatus = async (ipAddr = ip) => {
        if (!ipAddr) return;
        try {
            const res = await fetch(`http://${ipAddr}/status`);
            const data = await res.json();
            setStatus(data.status === 'aberto' ? 'Aberto' : 'Fechado');
        } catch (e) {
            setStatus('Erro ao conectar');
        }
    };

    const handleAcao = async (acao) => {
        if (!ip) return;
        setLoading(true);
        try {
            await fetch(`http://${ip}/${acao}`);
            await fetchStatus();
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível comunicar com o ESP32');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Title>Controle do Guarda-Chuva</Title>
            <Text style={styles.status}>Status: <Text style={{ fontWeight: 'bold' }}>{status}</Text></Text>
            <Button mode="contained" style={styles.button} onPress={() => handleAcao('abrir')} loading={loading} disabled={loading || status === 'Aberto'}>Abrir</Button>
            <Button mode="outlined" style={styles.button} onPress={() => handleAcao('fechar')} loading={loading} disabled={loading || status === 'Fechado'}>Fechar</Button>
            {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f2f2f2' },
    status: { marginVertical: 24, fontSize: 18 },
    button: { marginVertical: 8, width: 220 }
}); 