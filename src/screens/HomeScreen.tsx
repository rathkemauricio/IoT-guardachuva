import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Title, Text, ActivityIndicator, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getStatus, getPrevisaoApp } from '../services/esp32Api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation }: Props) {
    const [ip, setIp] = useState('');
    const [status, setStatus] = useState('Carregando...');
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState<{ clima: string; descricao: string; temperatura: number } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('esp32_ip').then(savedIp => {
            if (savedIp) {
                setIp(savedIp);
                fetchStatus(savedIp);
            }
        });
        fetchWeather();
    }, []);

    const fetchStatus = async (ipAddr = ip) => {
        if (!ipAddr) return;
        setLoading(true);
        const s = await getStatus(ipAddr);
        setStatus(s);
        setLoading(false);
    };

    const fetchWeather = async () => {
        setWeatherLoading(true);
        const data = await getPrevisaoApp();
        setWeather(data);
        setWeatherLoading(false);
    };

    return (
        <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <Title style={styles.title}>Guarda-Chuva IoT</Title>
                <Card style={styles.card} elevation={4}>
                    <Card.Content>
                        <Text style={styles.statusLabel}>Status do Dispositivo:</Text>
                        <Text style={styles.statusValue}>{status}</Text>
                        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
                    </Card.Content>
                </Card>
                <Card style={[styles.card, { marginBottom: 16, marginTop: -16 }]} elevation={4}>
                    <Card.Content>
                        <Text style={styles.statusLabel}>Previsão do Tempo</Text>
                        {weatherLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
                        {!weatherLoading && weather && (
                            <>
                                <Text style={styles.label}>Clima:</Text>
                                <Text style={styles.value}>{weather.clima}</Text>
                                <Text style={styles.label}>Descrição:</Text>
                                <Text style={styles.value}>{weather.descricao}</Text>
                                <Text style={styles.label}>Temperatura:</Text>
                                <Text style={styles.value}>{weather.temperatura} °C</Text>
                            </>
                        )}
                        {!weatherLoading && !weather && (
                            <Text style={styles.value}>Não foi possível obter a previsão.</Text>
                        )}
                    </Card.Content>
                </Card>
                <View style={styles.buttonsContainer}>
                    <Button
                        mode="contained"
                        icon={() => <MaterialCommunityIcons name="remote" size={22} color="#fff" />}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={() => navigation.navigate('Control')}
                    >
                        Controle
                    </Button>
                    <Button
                        mode="text"
                        icon={() => <MaterialIcons name="settings" size={22} color="#fff" />}
                        style={[styles.button, styles.settingsButton]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        Configurações
                    </Button>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 32,
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    card: {
        width: 320,
        borderRadius: 18,
        marginBottom: 32,
        backgroundColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    statusLabel: {
        fontSize: 16,
        color: '#2575fc',
        fontWeight: '600',
        marginBottom: 6,
    },
    statusValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6a11cb',
        marginBottom: 8,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        marginVertical: 8,
        width: 240,
        borderRadius: 12,
        elevation: 2,
    },
    buttonContent: {
        height: 48,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    settingsButton: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 0,
    },
    label: { fontSize: 16, color: '#2575fc', fontWeight: '600', marginTop: 8 },
    value: { fontSize: 18, color: '#333', marginBottom: 4 },
}); 