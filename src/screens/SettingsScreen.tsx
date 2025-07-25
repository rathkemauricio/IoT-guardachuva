import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Title, Text, TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('esp32_ip').then(savedIp => {
            if (savedIp) setIp(savedIp);
        });
    }, []);

    const handleSave = async () => {
        if (!ip) return;
        setLoading(true);
        await AsyncStorage.setItem('esp32_ip', ip);
        setLoading(false);
        Alert.alert('Sucesso', 'IP atualizado com sucesso!');
    };

    return (
        <LinearGradient
            colors={["#f7971e", "#ffd200"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <Title style={styles.title}>Configurações</Title>
                <Card style={styles.card} elevation={4}>
                    <Card.Content>
                        <Text style={styles.label}>IP do ESP32:</Text>
                        <TextInput
                            mode="outlined"
                            label="IP do ESP32"
                            value={ip}
                            onChangeText={setIp}
                            style={styles.input}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                            left={<TextInput.Icon icon={() => <MaterialIcons name="router" size={20} color="#f7971e" />} />}
                        />
                        <Button
                            mode="contained"
                            icon={() => <MaterialIcons name="save" size={20} color="#fff" />}
                            onPress={handleSave}
                            loading={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            Salvar
                        </Button>
                    </Card.Content>
                </Card>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Versão do app: 1.0.0</Text>
                    <Text style={styles.info}>Desenvolvido por Seu Nome</Text>
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
    label: {
        fontSize: 16,
        color: '#f7971e',
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    button: {
        marginTop: 8,
        width: '100%',
        borderRadius: 12,
        backgroundColor: '#f7971e',
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
    infoContainer: {
        alignItems: 'center',
    },
    info: {
        marginTop: 8,
        color: '#fff',
        fontSize: 14,
        textShadowColor: 'rgba(0,0,0,0.08)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
}); 