import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusMessage({ message }) {
    if (!message) return null;
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 1,
        minWidth: 200,
        alignItems: 'center'
    },
    text: {
        color: '#333',
        fontSize: 15
    }
}); 