import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [ip, setIp] = useState('');
    const [status, setStatus] = useState('Carregando...');
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        try {
            const res = await fetch(`http://${ipAddr}/status`);
            const data = await res.json();
            setStatus(data.status === 'aberto' ? 'Aberto' : 'Fechado');
        } catch (e) {
            setStatus('Erro ao conectar');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Title>Guarda-Chuva IoT</Title>
            <Text style={styles.status}>Status: <Text style={{ fontWeight: 'bold' }}>{status}</Text></Text>
            {loading && <ActivityIndicator style={{ marginBottom: 16 }} />}
            <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Control')}>Controle</Button>
            <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Weather')}>Previsão do Tempo</Button>
            <Button style={styles.button} onPress={() => navigation.navigate('Settings')}>Configurações</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f2f2f2' },
    status: { marginVertical: 24, fontSize: 18 },
    button: { marginVertical: 8, width: 220 }
}); 