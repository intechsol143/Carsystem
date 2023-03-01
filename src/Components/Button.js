import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({ title,onPress,style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button,{...style}]}>
            <Text style={styles.ttstyle}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius:8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#000"
    },
    ttstyle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})