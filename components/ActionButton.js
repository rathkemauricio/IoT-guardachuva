import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ActionButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1976d2',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 2
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
}); 