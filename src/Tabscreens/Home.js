import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth';
import Button from '../Components/Button';
import { homesheet } from '../Constants/Styles';
import Card from '../Components/Card';
import Icon from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/AntDesign'

import firestore from '@react-native-firebase/firestore';
import Loader from '../Components/Loader';

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState(null);

  const [username, setusername] = useState("")
  const [loading, setloading] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Icon name={"plus-circle"} size={24} color={"#000"}
            style={{ marginRight: 6 }}
            onPress={() => navigation.navigate("AddCar", { add: true })} />
          <Icon2 name={"logout"} size={22} color={"#000"} onPress={() =>signOut()} />

        </View>
      ),
      headerTitleAlign: 'center'

    })


  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // code
      fetchcars();
      _getUser()
    })
    return unsubscribe;

  }, [navigation, posts]);


  const fetchcars = async () => {
    setloading(true)
    try {
      const list = [];

      await firestore()
        .collection('cars')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          setloading(false)
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              userId,
              carColor,
              model,
              make,
              reg,
              carImage,
              category,
              postTime

            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              carColor,
              model,
              make,
              reg,
              carImage,
              category,
              postTime
            });
          });
        });

      setPosts(list);

      // if (loading) {
      //   setLoading(false);
      // }

      console.log('Posts: ', posts);
    } catch (e) {
      setloading(false)
      console.log(e);
    }
  };

  const _getUser = () => {
    firestore().collection('users').doc(auth().currentUser.uid).get().then((res) => {
      console.log("ressss", res.data())
      const name = res.data();
      setusername(name?.firstname)

    })
  }




  const signOut = async () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  const _edit = (item) => {
    navigation.navigate("AddCar", {
      item: item,
      edit: true
    })
  }

  return (
    <View style={homesheet.container}>
      {loading && <Loader />}
      {/* <Button
        title={"Sign Out"}
        onPress={() => signOut()}
      /> */}
      <View>
        {posts?.length >0 ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-around", paddingTop: 10 }}>
          <View style={homesheet.parentView}>
            <Text style={homesheet.txt}>User name</Text>
            <Text style={[homesheet.txt2, { color: "#000" }]}>{username}</Text>
          </View>
          <View style={homesheet.parentView}>
            <Text style={homesheet.txt}>Registered cars</Text>
            <Text style={[homesheet.txt2, { color: '#000' }]}>{posts?.length}</Text>
          </View>

        </View>:null}
      </View>
      <FlatList
        style={homesheet.flatliststyl}
        data={posts}
        numColumns={2}
        keyExtractor={(item, index) => item.id}
        renderItem={(item) =>
          <Card item={item.item}
            onPress={() => _edit(item.item)}
          />

        }
      />
    </View>
  )

}

export default Home

