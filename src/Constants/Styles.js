import { StyleSheet } from 'react-native'
export const Loginsheet = StyleSheet.create({
    container: {
        flex: 1
    },
    txt: { textAlign: 'center', marginTop: 6, color: '#000' }
})
export const fieldsheet = StyleSheet.create({
    field: {
        marginVertical: 6,
        paddingLeft: 10
    }
})
export const homesheet = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        flex: 1/2,
        margin: 5,
        padding:5,
        backgroundColor: '#fff',
        elevation:3,
        borderRadius: 10,
        // height: 130
    },
    flatliststyl:{
        margin:5
    },
    parentView:{
alignItems:'center'
    },
    txt:{
        color:'#000',
        fontSize:16,
        fontWeight:'bold'
    },
    txt2:{
        color:'#000',
        fontSize:16,
        fontWeight:"100"
    }
})
export const addcarsheet = StyleSheet.create({
    container: {
        flex: 1
    },
    pickimge:{
        height:100,
        width:100,
        borderRadius:100/2,
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:10

    }
    
})