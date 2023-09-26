import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputField from '../Components/InputField'
import Button from '../Components/Button'
import { Loginsheet, fieldsheet, homesheet } from '../Constants/Styles'
import auth from '@react-native-firebase/auth';
import Loader from '../Components/Loader'
import Icon from 'react-native-vector-icons/Entypo'
const Loginscreen = ({ navigation }) => {
    const [data, setdata] = useState({
        email: "",
        password: "",
        loading: false,
        eye: false
    })
    const [dataErr, setdataErr] = useState({
        emailErr: "",
        passwordErr: '',
        invalidErr: ''


    })

    const signIn = async () => {
        if (_validator()) {
            setdata({ ...data, loading: true })
            try {
                const result = await auth().signInWithEmailAndPassword(data.email, data.password)
                if (result) {
                    setdata({ ...data, loading: false })
                }
            } catch (error) {
                console.log("errr", error.Error)
                setdata({ ...data, loading: false })
                if (error.code === 'auth/user-not-found') {
                    setdata({ ...data, loader: false })
                    setdataErr({ ...dataErr, invalidErr: 'asd' })

                }

                if (error.code === 'auth/invalid-email') {
                    setdata({ ...data, loader: false })

                    console.log('That email address is invalid!');
                }

            }
        }



    }

    const _validator = () => {
        if (!data.email && !data.password) {
            setdataErr({ ...dataErr, emailErr: 'asd', passwordErr: 'asd' })
            return false
        }
        else if (!data.email) {
            setdataErr({ ...data, emailErr: 'asd' })
            return false
        }
        else if (!data.password) {
            setdataErr({ ...data, passwordErr: 'asd' })
            return false
        }

        return true
    }



    return (
        <View style={Loginsheet.container}>
            {data.loading && <Loader />}
            <View style={{ padding: 12 }}>
                <Text style={homesheet.txt}>Email</Text>
                <InputField
                    placeholder={"Email"}
                    autoCapitalize={'none'}
                    value={data.email}
                    style={{ borderWidth: .5, borderColor: dataErr.emailErr ? 'red' : null }}
                    onChangeText={(txt) => {
                        setdata({ ...data, email: txt })
                        setdataErr({ ...dataErr, emailErr: '',invalidErr:'' })
                    }}
                />
                <Text style={homesheet.txt}>Password</Text>

                <InputField
                    placeholder={"Password"}
                    style={{ borderWidth: .5, borderColor: dataErr.passwordErr ? 'red' : null }}
                    secureTextEntry={!data.eye}
                    eyeIcon={<Icon onPress={() => setdata({ ...data, eye: !data.eye })} name={data.eye ? "eye" : 'eye-with-line'} size={22} color={"black"} />}
                    value={data.password}
                    onChangeText={(txt) => {
                        setdata({ ...data, password: txt })
                        setdataErr({ ...dataErr, passwordErr: '',invalidErr:'' })

                    }

                    }
                />

                {dataErr.invalidErr ? <Text style={[homesheet.txt2, { color: 'red', textAlign: 'center' }]}>Invalid Username Or password</Text> : null}

                <Button
                    onPress={() => signIn()}
                    title={"Sign In"}
                    style={{ marginTop: 10 }}

                />
                <Text onPress={() => navigation.navigate("Signup")} style={Loginsheet.txt}>Don't have an account? Sign-Up</Text>
            </View>
        </View>
    )
}

export default Loginscreen

const styles = StyleSheet.create({})