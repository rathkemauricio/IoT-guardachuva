import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <View style={styles.container}>
            <Title>Configurações</Title>
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
            />
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
                Salvar
            </Button>
            <Text style={styles.info}>Versão do app: 1.0.0</Text>
            <Text style={styles.info}>Desenvolvido por Seu Nome</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f2f2f2' },
    label: { alignSelf: 'flex-start', marginBottom: 8 },
    input: { width: '100%', marginBottom: 16 },
    button: { marginTop: 8, width: '100%' },
    info: { marginTop: 24, color: '#888', fontSize: 14 }
}); 