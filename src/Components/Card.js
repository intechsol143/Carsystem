import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { addcarsheet, homesheet } from '../Constants/Styles'

const Card = ({ item,onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={homesheet.card}>
            <Image source={{ uri: item.carImage }} style={[addcarsheet.pickimge, { ...styles.img }]} />
            <View style={{ paddingTop: 6, paddingLeft: 4 }}>
            <Text style={homesheet.txt}>{item.category}</Text>
                <Text style={homesheet.txt}>{item.carColor}</Text>
                <Text style={homesheet.txt2}>{item.model}</Text>
                <Text style={homesheet.txt2}>{item.reg}</Text>
            </View>
        </TouchableOpacity>

    )
}

export default Card

const styles = StyleSheet.create({
    img: {
        borderRadius: 4,
        width: '100%',
        marginTop: 0
    }
})