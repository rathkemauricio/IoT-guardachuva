import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('esp32_ip').then(savedIp => {
            if (savedIp) {
                setIp(savedIp);
                navigation.replace('Home');
            }
        });
    }, []);

    const handleSave = async () => {
        if (!ip) return;
        setLoading(true);
        await AsyncStorage.setItem('esp32_ip', ip);
        setLoading(false);
        navigation.replace('Home');
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Conectar ao Guarda-Chuva</Title>
            <Text style={styles.label}>Digite o IP do seu ESP32:</Text>
            <TextInput
                mode="outlined"
                label="IP do ESP32"
                value={ip}
                onChangeText={setIp}
                style={styles.input}
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
                Salvar e Continuar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f2f2f2' },
    title: { marginBottom: 24 },
    label: { alignSelf: 'flex-start', marginBottom: 8 },
    input: { width: '100%', marginBottom: 16 },
    button: { marginTop: 8, width: '100%' }
}); 