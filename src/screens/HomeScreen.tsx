import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Button, Title, Text, ActivityIndicator, Card, TextInput, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getStatus, getPrevisaoApp, abrirGuardaChuva, fecharGuardaChuva } from '../services/esp32Api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation }: Props) {
    const [ip, setIp] = useState('');
    const [status, setStatus] = useState('Carregando...');
    const [loading, setLoading] = useState(true);
    const [controlLoading, setControlLoading] = useState(false);
    const [weather, setWeather] = useState<{ clima: string; descricao: string; temperatura: number } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [newIp, setNewIp] = useState('');
    const [savingIp, setSavingIp] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedIp = await AsyncStorage.getItem('esp32_ip');
            if (savedIp) {
                setIp(savedIp);
                setNewIp(savedIp);
                await fetchStatus(savedIp);
            } else {
                setStatus('IP não configurado');
                setLoading(false);
            }
            await fetchWeather();
        } catch (error) {
            setStatus('Erro ao carregar dados');
            setLoading(false);
        }
    };

    const fetchStatus = async (ipAddr = ip) => {
        if (!ipAddr) {
            setStatus('IP não configurado');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const s = await getStatus(ipAddr);
            setStatus(s);
        } catch (error) {
            setStatus('Erro de conexão');
        } finally {
            setLoading(false);
        }
    };

    const fetchWeather = async () => {
        try {
            setWeatherLoading(true);
            const data = await getPrevisaoApp();
            setWeather(data);
        } catch (error) {
            console.log('Erro ao buscar previsão do tempo');
        } finally {
            setWeatherLoading(false);
        }
    };

    const handleAcao = async (acao: 'abrir' | 'fechar') => {
        if (!ip) {
            Alert.alert('Erro', 'IP não configurado. Configure o IP nas configurações.');
            return;
        }

        setControlLoading(true);
        try {
            if (acao === 'abrir') {
                await abrirGuardaChuva(ip);
            } else {
                await fecharGuardaChuva(ip);
            }
            await fetchStatus();
            Alert.alert('Sucesso', `Guarda-chuva ${acao === 'abrir' ? 'aberto' : 'fechado'} com sucesso!`);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível comunicar com o ESP32. Verifique o IP e a conexão.');
        } finally {
            setControlLoading(false);
        }
    };

    const handleSaveIp = async () => {
        if (!newIp.trim()) {
            Alert.alert('Erro', 'Digite um IP válido');
            return;
        }

        // Validação básica de IP
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(newIp.trim())) {
            Alert.alert('Erro', 'Digite um IP válido (ex: 192.168.1.100)');
            return;
        }

        setSavingIp(true);
        try {
            await AsyncStorage.setItem('esp32_ip', newIp.trim());
            setIp(newIp.trim());
            await fetchStatus(newIp.trim());
            setShowSettings(false);
            Alert.alert('Sucesso', 'IP atualizado com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o IP');
        } finally {
            setSavingIp(false);
        }
    };

    const handleRefresh = async () => {
        await loadData();
    };

    // Determina visual do status
    const statusAberto = status.toLowerCase().includes('aberto');
    const statusFechado = status.toLowerCase().includes('fechado');
    const isChuva = weather && weather.clima && (
        weather.clima.toLowerCase().includes('rain') ||
        weather.clima.toLowerCase().includes('drizzle') ||
        weather.clima.toLowerCase().includes('thunderstorm')
    );

    return (
        <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Title style={styles.title}>Guarda-Chuva IoT</Title>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={handleRefresh}
                            disabled={loading || controlLoading}
                        >
                            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Status Card */}
                    <Card style={styles.card} elevation={4}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons
                                    name="information"
                                    size={24}
                                    color="#2575fc"
                                />
                                <Text style={styles.cardTitle}>Status do Dispositivo</Text>
                            </View>
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons
                                    name={statusAberto ? 'umbrella' : statusFechado ? 'umbrella-outline' : 'umbrella'}
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

                    {/* Weather Card */}
                    <Card style={[styles.card, isChuva && styles.chuvaCard]} elevation={4}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons
                                    name="weather-partly-cloudy"
                                    size={24}
                                    color={isChuva ? '#1976d2' : '#2575fc'}
                                />
                                <Text style={styles.cardTitle}>Previsão do Tempo</Text>
                            </View>
                            {weatherLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
                            {!weatherLoading && weather && (
                                <>
                                    <View style={styles.weatherRow}>
                                        <Text style={styles.weatherLabel}>Clima:</Text>
                                        <Text style={[styles.weatherValue, isChuva && styles.chuvaText]}>
                                            {weather.clima}
                                        </Text>
                                    </View>
                                    <View style={styles.weatherRow}>
                                        <Text style={styles.weatherLabel}>Descrição:</Text>
                                        <Text style={styles.weatherValue}>{weather.descricao}</Text>
                                    </View>
                                    <View style={styles.weatherRow}>
                                        <Text style={styles.weatherLabel}>Temperatura:</Text>
                                        <Text style={styles.weatherValue}>{weather.temperatura} °C</Text>
                                    </View>
                                    {isChuva && (
                                        <View style={styles.alertaContainer}>
                                            <MaterialCommunityIcons name="alert-circle" size={20} color="#d32f2f" />
                                            <Text style={styles.alerta}>Leve seu guarda-chuva!</Text>
                                        </View>
                                    )}
                                </>
                            )}
                            {!weatherLoading && !weather && (
                                <Text style={styles.errorText}>Não foi possível obter a previsão.</Text>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Control Card */}
                    <Card style={styles.card} elevation={4}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons
                                    name="remote"
                                    size={24}
                                    color="#2575fc"
                                />
                                <Text style={styles.cardTitle}>Controle do Guarda-Chuva</Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                                <Button
                                    mode="contained"
                                    icon={() => <MaterialCommunityIcons name="arrow-up-bold-circle" size={22} color="#fff" />}
                                    style={[styles.controlButton, styles.abrirButton, statusAberto && styles.buttonDisabled]}
                                    contentStyle={styles.buttonContent}
                                    labelStyle={styles.buttonLabel}
                                    onPress={() => handleAcao('abrir')}
                                    loading={controlLoading}
                                    disabled={controlLoading || statusAberto}
                                >
                                    Abrir
                                </Button>
                                <Button
                                    mode="contained"
                                    icon={() => <MaterialCommunityIcons name="arrow-down-bold-circle" size={22} color="#fff" />}
                                    style={[styles.controlButton, styles.fecharButton, statusFechado && styles.buttonDisabled]}
                                    contentStyle={styles.buttonContent}
                                    labelStyle={styles.buttonLabel}
                                    onPress={() => handleAcao('fechar')}
                                    loading={controlLoading}
                                    disabled={controlLoading || statusFechado}
                                >
                                    Fechar
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Settings Card */}
                    <Card style={styles.card} elevation={4}>
                        <Card.Content>
                            <View style={styles.cardHeader}>
                                <MaterialIcons
                                    name="settings"
                                    size={24}
                                    color="#2575fc"
                                />
                                <Text style={styles.cardTitle}>Configurações</Text>
                            </View>

                            {!showSettings ? (
                                <View style={styles.settingsInfo}>
                                    <Text style={styles.settingsText}>IP atual: {ip || 'Não configurado'}</Text>
                                    <Button
                                        mode="outlined"
                                        onPress={() => setShowSettings(true)}
                                        style={styles.settingsButton}
                                    >
                                        Alterar IP
                                    </Button>
                                </View>
                            ) : (
                                <View style={styles.settingsForm}>
                                    <TextInput
                                        mode="outlined"
                                        label="IP do ESP32"
                                        value={newIp}
                                        onChangeText={setNewIp}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Ex: 192.168.1.100"
                                    />
                                    <View style={styles.settingsButtons}>
                                        <Button
                                            mode="outlined"
                                            onPress={() => setShowSettings(false)}
                                            style={styles.cancelButton}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            mode="contained"
                                            onPress={handleSaveIp}
                                            loading={savingIp}
                                            style={styles.saveButton}
                                        >
                                            Salvar
                                        </Button>
                                    </View>
                                </View>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Info Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Versão 1.0.0</Text>
                        <Text style={styles.footerText}>Guarda-Chuva IoT</Text>
                    </View>
                </ScrollView>
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
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1.1,
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    card: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.97)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
    },
    chuvaCard: {
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2',
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2575fc',
        marginLeft: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#185a9d',
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    weatherLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2575fc',
    },
    weatherValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    chuvaText: {
        color: '#1976d2',
        fontWeight: 'bold',
    },
    alertaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 8,
        backgroundColor: '#ffebee',
        borderRadius: 8,
    },
    alerta: {
        marginLeft: 8,
        color: '#d32f2f',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
        fontStyle: 'italic',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8,
    },
    controlButton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
        elevation: 2,
    },
    abrirButton: {
        backgroundColor: '#43cea2',
    },
    fecharButton: {
        backgroundColor: '#d7263d',
    },
    buttonContent: {
        height: 48,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    settingsInfo: {
        alignItems: 'center',
    },
    settingsText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    settingsButton: {
        borderColor: '#2575fc',
        borderWidth: 2,
    },
    settingsForm: {
        marginTop: 8,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    settingsButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        borderColor: '#666',
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#2575fc',
    },
    footer: {
        alignItems: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
}); 