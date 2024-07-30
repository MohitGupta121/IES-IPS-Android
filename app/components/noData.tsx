import { StyleSheet, View } from 'react-native'
import React from 'react'
import No_data from "../assets/images/no_data.svg"
import { Text } from 'react-native-paper'



const NoData = ({text}) => {
  return (
    <View style = {[{flex : 1 , justifyContent: 'center',alignItems: 'center',}]}> 
        <View style={{  flex:1 , alignItems:"center" , justifyContent: 'center',}}>
            <No_data width={250} height={300}  />
            <Text variant='headlineSmall'>{text}</Text>
        </View>
    </View>
  )
}

export default NoData
