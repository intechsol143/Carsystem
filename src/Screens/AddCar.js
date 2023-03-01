import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { addcarsheet, fieldsheet, homesheet } from '../Constants/Styles'
import InputField from '../Components/InputField'
import Icon from 'react-native-vector-icons/Entypo'
import Button from '../Components/Button'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import Loader from '../Components/Loader'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AddCar = ({ route, navigation }) => {
    const item = route?.params?.item;
    const edit = route?.params?.edit;
    const add = route?.params?.add

    console.log("item", item)
    const [carCat, setcarCat] = useState([
        "Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Convertible", "Pickup Truck"
    ])

    // const countries = []

    useEffect(() => {
        navigation.setOptions({
            title: item ? "Car Detail" : edit == true ? "Edit Car" : "Add Car",
            headerTitleAlign: 'center'
        })
    }, [])

    const [cardata, setcardata] = useState({
        color: item?.carColor ? item.carColor : "",
        model: item?.model ? item.model : "",
        make: item?.make ? item.make : '',
        reg_no: item?.reg ? item.reg : '',
        image: item?.carImage ? item.carImage : "",
        uploading: false,
        transferred: false,
        cChange: item?.category ? true : false,
        cat:item?.category ? item?.category : ''

    })
    const [cardataErr, setcardataErr] = useState({
        colorErr: "",
        modelErr: "",
        makeErr: '',
        reg_noErr: '',
        imageErr: "",
        catErr: ''

    })
    const _validator = () => {
        if (!cardata.image && !cardata.color && !cardata.make && !cardata.reg_no && !cardata.cat) {
            setcardataErr({
                ...cardataErr,
                colorErr: 'asd',
                imageErr: 'asf',
                modelErr: 'asd',
                makeErr: 'asd',
                reg_noErr: 'asd',
                catErr: 'asd'
            })
            return false
        }
        else if (!cardata.image) {
            setcardataErr({ ...cardataErr, imageErr: 'asd' })
            return false
        }
        else if (!cardata.cat) {
            setcardataErr({ ...cardataErr, catErr: 'ask' })
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
            setcardataErr({ ...cardataErr, imageErr: '' })
        });
    };

    const submitCar = async () => {
        if (_validator()) {
            setcardata({ ...cardata, uploading: true })
            const imageUrl = await uploadImage();
            firestore()
                .collection('cars')
                .add({
                    userId: auth().currentUser.uid,
                    carColor: cardata.color,
                    model: cardata.model,
                    make: cardata.make,
                    reg: cardata.reg_no,
                    category: cardata.cat,
                    carImage: imageUrl,
                    postTime: firestore.Timestamp.fromDate(new Date()),

                })
                .then(() => {
                    setcardata({ ...cardata, uploading: false })
                    Alert.alert('Car published!', 'Your car has been published Successfully!', [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);

                })
                .catch((error) => {
                    setcardata({ ...cardata, uploading: false })

                    console.log('Something went wrong with added car to firestore.', error);
                });
        }

    }

    const updateCar = async () => {
        if (_validator()) {
            setcardata({ ...cardata, uploading: true })
            const imageUrl = await uploadImage();
            firestore().collection('cars').doc(item.id).update({
                carColor: cardata.color,
                model: cardata.model,
                make: cardata.make,
                reg: cardata.reg_no,
                category: cardata.cat,
                carImage: imageUrl ? imageUrl : cardata.image,
            }).then(() => {
                setcardata({ ...cardata, uploading: false })

                Alert.alert('Car Updated!', 'Your car data has been updated successfully!', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);


            })


        }

    }

    const DeleteCar = async () => {
        if (_validator()) {
            setcardata({ ...cardata, uploading: true })

            firestore().collection('cars').doc(item.id).delete().then(() => {
                setcardata({ ...cardata, uploading: false })

                Alert.alert('You Deleted!', 'Your car data has been deleted successfully!', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);


            })


        }

    }

    const uploadImage = async () => {

        const uploadUri = cardata.image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
        const extension = filename.split('.').pop();
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
        setcardata({ ...cardata, transferred: true })
        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);
        try {
            await task;
            const url = await storageRef.getDownloadURL();
            // setcardata({ ...cardata, image: null })
            return url;

        } catch (e) {
            console.log(e);
            return null;
        }

    };
    return (
        <View style={addcarsheet.container}>
            {cardata.uploading && <Loader />}
            <ScrollView>
                <View style={{ padding: 12 }}>
                    <TouchableOpacity onPress={() => addCarImage()} style={[addcarsheet.pickimge, { borderColor: cardataErr.imageErr ? 'red' : null }]}>
                        {!cardata.image ? <Icon name={"camera"} size={32} /> : <Image source={{ uri: cardata.image }} style={[addcarsheet.pickimge, { marginTop: 0 }]} />}
                    </TouchableOpacity>
                    <View style={{ height: 15 }} />

                    <SelectDropdown
                        data={carCat}
                        defaultButtonText={item?.category ? item?.category : "Select Category"}
                        onSelect={(selectedItem, index) => {
                            setcardata({
                                ...cardata,
                                cat: selectedItem,
                                cChange: true

                            })
                            setcardataErr({ ...cardataErr, catErr: '' })

                            // setcardataErr({ ...cardataErr, catErr: "" })
                        }}
                        buttonTextStyle={
                            [styles.dropdown2BtnTxtStyle, {
                                color: cardata.cChange === false ? 'lightgrey' : 'black',
                            }]
                        }
                        buttonStyle={[styles.ddnBtn, {
                            borderColor: cardataErr.catErr ? 'red' : null,
                            borderWidth: cardataErr.catErr ? .5 : .5,
                        }]}
                        renderDropdownIcon={isOpened => {
                            return (
                                <FontAwesome
                                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                                    color={"#000"}
                                    size={15}
                                />
                            );
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {

                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem
                        }}
                        rowTextForSelection={(item, index) => {

                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item
                        }}
                    />
                    <View style={{ height: 15 }} />
                    <Text style={homesheet.txt}>Color</Text>
                    <InputField
                        placeholder={"Color"}
                        style={{ borderWidth: .5, borderColor: cardataErr.colorErr ? 'red' : null }}
                        value={cardata.color}
                        onChangeText={(txt) => {
                            setcardata({ ...cardata, color: txt })
                            setcardataErr({ ...cardataErr, colorErr: '' })
                        }}
                    />
                    <Text style={homesheet.txt}>Model</Text>
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
                    <Text style={homesheet.txt}>Make</Text>
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
                    <Text style={homesheet.txt}>Registration number</Text>
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
                    {item?.userId == auth().currentUser.uid ?
                        <View>
                            <Button title={edit ? "Edit Car" : "Submit car"}
                                onPress={() => { edit ? updateCar() : submitCar() }}
                                style={{ marginTop: 10 }}
                            />
                            <Button title={"Delete Car"}
                                onPress={() => {
                                    Alert.alert('Are you sure!', 'Your car will be deleted!', [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => DeleteCar() },
                                    ]);
                                }}
                                style={{ marginTop: 10, backgroundColor: 'red' }}
                            />
                        </View>

                        : add == true ? <Button title={edit ? "Edit Car" : "Submit car"}
                            onPress={() => { edit ? updateCar() : submitCar() }}
                            style={{ marginTop: 10 }}
                        /> : null}
                </View>
            </ScrollView>
        </View>
    )
}

export default AddCar

const styles = StyleSheet.create({
    dropdown2BtnTxtStyle: {
        color: 'lightgrey',
        // backgroundColor:'red',
        fontSize: 14,
        textAlign: 'left',

        // fontFamily: Styles.Regular,
    },
    ddnBtn: {
        width: '100%',
        alignSelf: 'center',
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: .5
        },
        shadowRadius: 1,
        shadowOpacity: 0.5,
        backgroundColor: '#fff',
        borderRadius: 6,
    }
})