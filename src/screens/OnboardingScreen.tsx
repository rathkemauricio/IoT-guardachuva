import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<any>;

export default function OnboardingScreen({ navigation }: Props) {
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
        <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => Alert.alert('Sair', 'Deseja sair do app?', [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Sair', style: 'destructive', onPress: () => {} }
                    ])}
                >
                    <MaterialCommunityIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
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
        marginBottom: 24, 
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.18)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    label: { 
        alignSelf: 'flex-start', 
        marginBottom: 8, 
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    input: { width: '100%', marginBottom: 16 },
    button: { marginTop: 8, width: '100%' }
}); 