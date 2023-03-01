import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { addcarsheet } from '../Constants/Styles'
import InputField from '../Components/InputField'
import Icon from 'react-native-vector-icons/Entypo'
import Button from '../Components/Button'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';

const EditCar = () => {

    const [userData, setuserData] = useState({})

    useEffect(() => {
        getUser();
    }, [])


    console.log("userDatauserData",userData)

    const getUser = async () => {
        const currentUser = await firestore()
            .collection('cars')
            .doc(auth().currentUser.uid)
            .get()
            .then((documentSnapshot) => {
                console.log("--====",documentSnapshot.data())
                if (documentSnapshot.exists) {
                    console.log('User Data', documentSnapshot.data());
                    setuserData(documentSnapshot.data())
                    // setcardata({ ...cardata, userData: documentSnapshot.data() })
                    // setUserData(documentSnapshot.data());
                }
            })
    }
    const [cardata, setcardata] = useState({
        color: userData.carColor ? userData.carColor : "",
        model: userData.model ? userData.model : "",
        make: userData.make ? userData.make : '',
        reg_no: userData.reg ? userData.reg : '',
        image: userData.carImage ? userData.carImage : "",
        uploading: false,
        transferred: false,
    })
    const [cardataErr, setcardataErr] = useState({
        colorErr: "",
        modelErr: "",
        makeErr: '',
        reg_noErr: '',
        imageErr: "",

    })



    const handleUpdate = async () => {
        let imgUrl = await uploadImage();

        if (imgUrl == null && userData.userImg) {
            imgUrl = userData.userImg;
        }
        firestore()
            .collection('cars')
            .doc(auth().currentUser.uid)
            .update({
                userId: auth().currentUser.uid,
                carColor: cardata.color,
                model: cardata.model,
                make: cardata.make,
                reg: cardata.reg_no,
                carImage: cardata.image,
            })
            .then(() => {
                console.log('User Updated!');
                Alert.alert(
                    'Profile Updated!',
                    'Your profile has been updated successfully.'
                );
            })
    }

    const _validator = () => {
        if (!cardata.image && !cardata.color && !cardata.make && !cardata.reg_no) {
            setcardataErr({
                ...cardataErr, colorErr: 'asd',
                imageErr: 'asf',
                modelErr: 'asd', makeErr: 'asd', reg_noErr: 'asd'
            })
            return false
        }
        else if (!cardata.image) {
            setcardataErr({ ...cardataErr, imageErr: 'asd' })
            return false
        }
        else if (!cardata.color) {
            setcardataErr({ ...cardataErr, colorErr: 'asd' })
            return false
        }
        else if (!cardata.model) {
            setcardataErr({ ...cardataErr, modelErr: 'asd' })
            return false
        }
        else if (!cardata.make) {
            setcardataErr({ ...cardataErr, makeErr: 'asd' })
            return false
        }
        else if (!cardata.reg_no) {
            setcardataErr({ ...cardataErr, reg_noErr: 'asd' })
            return false
        }
        return true
    }




    const addCarImage = () => {
        ImagePicker.openPicker({
            width: 1200,
            height: 780,
            cropping: true,
        }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setcardata({ ...cardata, image: imageUri });
            setcardataErr({ ...cardata, imageErr: '' })
        });
    };

    const submitCar = async () => {
        if (_validator()) {
            const imageUrl = await uploadImage();
            firestore()
                .collection('cars')
                .add({
                    userId: auth().currentUser.uid,
                    carColor: cardata.color,
                    model: cardata.model,
                    make: cardata.make,
                    reg: cardata.reg_no,
                    carImage: imageUrl,
                    postTime: firestore.Timestamp.fromDate(new Date()),

                })
                .then(() => {
                    Alert.alert(
                        'Car published!',
                        'Your car has been published Successfully!',
                    );
                })
                .catch((error) => {
                    console.log('Something went wrong with added car to firestore.', error);
                });
        }

    }

    const uploadImage = async () => {
        if (cardata.image == null) {
            return null;
        }
        const uploadUri = cardata.image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

        // Add timestamp to File Name
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;

        setcardata({ ...cardata, uploading: true })
        setcardata({ ...cardata, transferred: true })



        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);

        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
            console.log(
                `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
            );


        });

        try {
            await task;

            const url = await storageRef.getDownloadURL();

            setcardata({ ...cardata, uploading: false })
            setcardata({ ...cardata, image: null })


            return url;

        } catch (e) {
            console.log(e);
            return null;
        }

    };
    return (
        <View style={addcarsheet.container}>
            <View style={{ padding: 12 }}>
                <TouchableOpacity onPress={() => addCarImage()} style={[addcarsheet.pickimge, { borderColor: cardataErr.imageErr ? 'red' : null }]}>
                    {!cardata.image ? <Icon name={"camera"} size={32} /> : <Image source={{ uri: cardata.image }} style={[addcarsheet.pickimge, { marginTop: 0 }]} />}
                </TouchableOpacity>
                <View style={{ height: 15 }} />
                <InputField
                    placeholder={"Color"}
                    style={{ borderWidth: .5, borderColor: cardataErr.colorErr ? 'red' : null }}
                    value={cardata.color}
                    onChangeText={(txt) => {
                        setcardata({ ...cardata, color: txt })
                        setcardataErr({ ...cardataErr, colorErr: '' })
                    }}
                />
                <InputField
                    placeholder={"model"}
                    style={{ borderWidth: .5, borderColor: cardataErr.modelErr ? 'red' : null }}

                    // style={[fieldsheet.field]}
                    value={cardata.model}
                    onChangeText={(txt) => {
                        setcardata({ ...cardata, model: txt })
                        setcardataErr({ ...cardataErr, modelErr: '' })
                    }}
                />
                <InputField
                    placeholder={"make"}
                    style={{ borderWidth: .5, borderColor: cardataErr.makeErr ? 'red' : null }}


                    // style={fieldsheet.field}
                    value={cardata.make}
                    onChangeText={(txt) => {
                        setcardata({ ...cardata, make: txt })
                        setcardataErr({ ...cardataErr, makeErr: '' })
                    }}
                />
                <InputField
                    placeholder={"Reg-number"}
                    // style={fieldsheet.field}
                    style={{ borderWidth: .5, borderColor: cardataErr.reg_noErr ? 'red' : null }}


                    value={cardata.reg_no}
                    onChangeText={(txt) => {
                        setcardata({ ...cardata, reg_no: txt })
                        setcardataErr({ ...cardataErr, reg_noErr: '' })
                    }}
                />
                <Button title={"Submit car"}
                    onPress={() => submitCar()}
                    style={{ marginTop: 10 }}
                />
            </View>
        </View>
    )
}

export default EditCar

const styles = StyleSheet.create({})