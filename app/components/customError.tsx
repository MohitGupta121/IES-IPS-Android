import { StyleSheet, View } from 'react-native'
import React from 'react'
import Error from "../assets/images/error.svg"
import { Text } from 'react-native-paper'



const CustomError = ({text}) => {
  return (
    <View style = {[{flex : 1 , justifyContent: 'center',alignItems: 'center',}]}> 
        <View style={{  flex:1 , alignItems:"center" , justifyContent: 'center',}}>
            <Error width={250} height={300}  />
            <Text variant='headlineSmall'>Error Occured</Text>
            <Text variant='bodySmall'>{text}</Text>
        </View>
    </View>
  )
}

export default CustomError
