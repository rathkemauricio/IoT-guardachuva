import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Button, Title, Text, ActivityIndicator, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { abrirGuardaChuva, fecharGuardaChuva, getStatus } from '../services/esp32Api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any>;

export default function ControlScreen({ }: Props) {
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
        const s = await getStatus(ipAddr);
        setStatus(s);
    };

    const handleAcao = async (acao: 'abrir' | 'fechar') => {
        if (!ip) return;
        setLoading(true);
        try {
            if (acao === 'abrir') await abrirGuardaChuva(ip);
            else await fecharGuardaChuva(ip);
            await fetchStatus();
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível comunicar com o ESP32');
        }
        setLoading(false);
    };

    // Determina visual do status
    const statusAberto = status.toLowerCase().includes('aberto');
    const statusFechado = status.toLowerCase().includes('fechado');
    return (
        <LinearGradient
            colors={["#43cea2", "#185a9d"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <Title style={styles.title}>Controle do Guarda-Chuva</Title>
                <Card style={styles.card} elevation={4}>
                    <Card.Content style={{ alignItems: 'center' }}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <View style={styles.statusRow}>
                            <MaterialCommunityIcons
                                name={statusAberto ? 'umbrella-open' : statusFechado ? 'umbrella-closed' : 'umbrella'}
                                size={32}
                                color={statusAberto ? '#43cea2' : statusFechado ? '#d7263d' : '#185a9d'}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[
                                styles.statusValue,
                                statusAberto && { color: '#43cea2' },
                                statusFechado && { color: '#d7263d' }
                            ]}>
                                {status}
                            </Text>
                        </View>
                        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
                    </Card.Content>
                </Card>
                <View style={styles.buttonsContainer}>
                    <Button
                        mode="contained"
                        icon={() => <MaterialCommunityIcons name="arrow-up-bold-circle" size={22} color="#fff" />}
                        style={[styles.button, statusAberto && styles.buttonDisabled]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={() => handleAcao('abrir')}
                        loading={loading}
                        disabled={loading || statusAberto}
                    >
                        Abrir
                    </Button>
                    <Button
                        mode="contained"
                        icon={() => <MaterialCommunityIcons name="arrow-down-bold-circle" size={22} color="#fff" />}
                        style={[styles.button, styles.fecharButton, statusFechado && styles.buttonDisabled]}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                        onPress={() => handleAcao('fechar')}
                        loading={loading}
                        disabled={loading || statusFechado}
                    >
                        Fechar
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 32,
        letterSpacing: 1.1,
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    card: {
        width: 320,
        borderRadius: 18,
        marginBottom: 32,
        backgroundColor: 'rgba(255,255,255,0.97)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    statusLabel: {
        fontSize: 16,
        color: '#185a9d',
        fontWeight: '600',
        marginBottom: 6,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#185a9d',
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
        backgroundColor: '#43cea2',
    },
    fecharButton: {
        backgroundColor: '#d7263d',
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
    buttonDisabled: {
        opacity: 0.6,
    },
}); 