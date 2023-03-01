import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

const InputField = ({
    onChangeText,
    value,
    style,
    secureTextEntry,
    placeholder,
    eyeIcon,
    autoCapitalize
}) => {
    return (
        <View>
            <TextInput
                style={[styles.fStyle, { ...style }]}
                placeholder={placeholder}
                onChangeText={onChangeText}
                value={value}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
            />
            {eyeIcon ? <View style={{ position: 'absolute', alignSelf: 'flex-end', top: "30%", paddingRight: 12 }}>
                {eyeIcon}
            </View> : null}
        </View>
    )
}

export default InputField

const styles = StyleSheet.create({
    fStyle: {
        height: 50,
        backgroundColor: '#fff',
        // margin: 10,
        elevation: 3,
        marginVertical: 6,
        paddingLeft: 10,
        borderRadius: 6
    }
})