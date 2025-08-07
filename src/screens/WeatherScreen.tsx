import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Title, Text, ActivityIndicator, Card } from 'react-native-paper';
import { getPrevisaoApp } from '../services/esp32Api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<any>;

export default function WeatherScreen({ navigation }: Props) {
    const [loading, setLoading] = useState(true);
    const [previsao, setPrevisao] = useState<{ clima: string; descricao: string; temperatura: number } | null>(null);

    useEffect(() => {
        fetchPrevisao();
    }, []);

    const fetchPrevisao = async () => {
        setLoading(true);
        const data = await getPrevisaoApp();
        setPrevisao(data);
        setLoading(false);
    };

    const isChuva = previsao && previsao.clima && (
        previsao.clima.toLowerCase().includes('rain') ||
        previsao.clima.toLowerCase().includes('drizzle') ||
        previsao.clima.toLowerCase().includes('thunderstorm')
    );

    return (
        <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Title style={styles.title}>Previsão do Tempo</Title>
                {loading && <ActivityIndicator style={{ marginTop: 24 }} />}
                {!loading && previsao && (
                    <Card style={[styles.card, isChuva && styles.chuvaCard]}>
                        <Card.Content>
                            <Text style={styles.label}>Clima:</Text>
                            <Text style={[styles.value, isChuva && styles.chuvaText]}>{previsao.clima}</Text>
                            <Text style={styles.label}>Descrição:</Text>
                            <Text style={styles.value}>{previsao.descricao}</Text>
                            <Text style={styles.label}>Temperatura:</Text>
                            <Text style={styles.value}>{previsao.temperatura} °C</Text>
                            {isChuva && <Text style={styles.alerta}>⚠️ Leve seu guarda-chuva!</Text>}
                        </Card.Content>
                    </Card>
                )}
                            {!loading && !previsao && (
                <Text style={styles.text}>Não foi possível obter a previsão.</Text>
            )}
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
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 32,
        letterSpacing: 1.1,
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    card: { marginTop: 32, width: 320, backgroundColor: '#fff' },
    chuvaCard: { backgroundColor: '#e3f2fd', borderColor: '#1976d2', borderWidth: 2 },
    label: { marginTop: 8, fontWeight: 'bold', fontSize: 16 },
    value: { fontSize: 18, marginBottom: 4 },
    chuvaText: { color: '#1976d2', fontWeight: 'bold' },
    alerta: { marginTop: 16, color: '#d32f2f', fontWeight: 'bold', fontSize: 18 },
    text: { marginTop: 24, fontSize: 18, color: '#fff' },
}); 