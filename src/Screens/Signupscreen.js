import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputField from '../Components/InputField'
import Button from '../Components/Button'
import { fieldsheet, homesheet, Loginsheet } from '../Constants/Styles'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Entypo'
import { ScrollView } from 'react-native'
import Loader from '../Components/Loader'

const Signupscreen = ({ navigation }) => {
    const [data, setdata] = useState({
        firstname: "",
        lastname: "",
        email: '',
        password: '',
        confirm_password: "",
        eye: false,
        eye2: false,
        loader: false,
    })
    const [dataErr, setdataErr] = useState({
        firstnameErr: "",
        lastnameErr: "",
        emailErr: '',
        passwordErr: '',
        confirm_passwordErr: "",
        passwordmatchErr: '',
        emailinuse: '',
        passlenghtErr: ''


    })

    const _validator = () => {
        if (!data.firstname && !data.lastname && !data.password && !data.confirm_password) {
            setdataErr({ ...dataErr, emailErr: 'asd', passwordErr: 'asd', firstnameErr: 'asd', lastnameErr: 'asd', confirm_passwordErr: 'asd' })
            return false
        }
        else if (!data.firstname) {
            setdataErr({ ...data, firstnameErr: 'asd' })
            return false
        }
        else if (!data.lastname) {
            setdataErr({ ...data, lastnameErr: 'asd' })
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
        else if (!data.confirm_password) {
            setdataErr({ ...data, confirm_passwordErr: 'asd' })
            return false
        }
        else if (data.password != data.confirm_password) {
            setdataErr({ ...data, passwordmatchErr: 'asd' })
            return false
        }
        else if (data.password.length < 6 || data.confirm_password.length < 6) {
            setdataErr({ ...data, passlenghtErr: 'asd' })
            return false
        }

        return true
    }

    const registerUser = async () => {
        if (_validator()) {
            setdata({ ...data, loader: true })
            try {
                const result = await auth().createUserWithEmailAndPassword(data.email, data.password)
                setdata({ ...data, loader: false })
                firestore().collection('users').doc(auth().currentUser.uid).set({
                    firstname: data.firstname,
                    email: result.user.email,
                    uid: result.user.uid,
                })
                //   setLoading(false)
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setdata({ ...data, loader: false })

                    setdataErr({ ...dataErr, emailinuse: "That email address is already in use!" })
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    setdata({ ...data, loader: false })

                    console.log('That email address is invalid!');
                }
            }
        }

    }
    return (
        <View style={styles.container}>
            {data.loader && <Loader />}
            <ScrollView>
                <View style={{ padding: 12 }}>
                    <Text style={homesheet.txt}>First name</Text>
                    <InputField
                        placeholder={"First name"}
                        value={data.firstname}
                        style={{ borderWidth: .5, borderColor: dataErr.firstnameErr ? 'red' : null }}

                        onChangeText={(txt) => {

                            setdata({ ...data, firstname: txt })
                            setdataErr({ ...dataErr, firstnameErr: '' })
                        }}
                    />
                    <Text style={homesheet.txt}>Last name</Text>

                    <InputField
                        placeholder={"Last name"}
                        value={data.lastname}
                        style={{ borderWidth: .5, borderColor: dataErr.lastnameErr ? 'red' : null }}
                        onChangeText={(txt) => {setdata({ ...data, lastname: txt })
                        setdataErr({ ...dataErr, lastnameErr: '' })
                    }}
                    />
                    <Text style={homesheet.txt}>Email</Text>
                    <InputField
                        placeholder={"Email"}
                        autoCapitalize={'none'}
                        value={data.email}
                        style={{ borderWidth: .5, borderColor: dataErr.emailErr ? 'red' : null }}
                        onChangeText={(txt) => {
                            setdata({ ...data, email: txt })
                            setdataErr({ ...dataErr, emailinuse: '',emailErr:'' })
                        }}
                    />
                    <Text style={homesheet.txt}>Password</Text>

                    <InputField
                        placeholder={"Password"}
                        value={data.password}
                        secureTextEntry={!data.eye}
                        eyeIcon={<Icon onPress={() => setdata({ ...data, eye: !data.eye })} name={data.eye ? "eye" : 'eye-with-line'} size={22} color={"black"} />}
                        style={{ borderWidth: .5, borderColor: dataErr.passwordErr ? 'red' : null }}
                        onChangeText={(txt) => {
                            setdata({ ...data, password: txt })
                            setdataErr({ ...dataErr, 
                                passlenghtErr: '', 
                                passwordmatchErr: '' ,
                                passwordErr:''
                            
                            })
                        }}
                    />
                    <Text style={homesheet.txt}>Confirm Password</Text>

                    <InputField
                        placeholder={"Confirm password"}
                        value={data.confirm_password}
                        secureTextEntry={!data.eye2}
                        eyeIcon={<Icon onPress={() => setdata({ ...data, eye2: !data.eye2 })} name={data.eye2 ? "eye" : 'eye-with-line'} size={22} color={"black"} />}
                        style={{ borderWidth: .5, borderColor: dataErr.confirm_passwordErr ? 'red' : null }}
                        onChangeText={(txt) => {
                            setdata({ ...data, confirm_password: txt })
                            setdataErr({ ...dataErr, passlenghtErr: '',
                            confirm_passwordErr:'',
                            passwordmatchErr: '' })
                        }}
                    />
                    {dataErr.emailinuse ? <Text style={[homesheet.txt2, { color: 'red', textAlign: 'center' }]}>{dataErr.emailinuse}</Text> : null}
                    {dataErr.passwordmatchErr ? <Text style={[homesheet.txt2, { color: 'red', textAlign: 'center' }]}>{"The password are mismatched."}</Text> : null}
                    {dataErr.passlenghtErr ? <Text style={[homesheet.txt2, { color: 'red', textAlign: 'center' }]}>{"The password length should be 6 letters!."}</Text> : null}

                    <Button
                        onPress={() => registerUser()}
                        title={"Sign Up"}
                        style={{ marginTop: 10 }}

                    />
                    <Text onPress={() => navigation.goBack()} style={Loginsheet.txt}>Already have an account? Sign-In</Text>

                </View>
            </ScrollView>
        </View>
    )
}

export default Signupscreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})