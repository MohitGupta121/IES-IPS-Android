import { StyleSheet, View } from 'react-native'
import {List, Text } from 'react-native-paper'
import React,{useEffect} from 'react'
import { useTheme } from 'react-native-paper';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import { themeType } from '../../../theme';
import ProgressCustom, { ProgressColorProp } from '../../../components/progressCustom';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';

const ItemList = ({item}) => {

    const theme:themeType = useTheme();
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const styles = StyleSheet.create({
        listItem:{
          borderRadius : 10,
          margin: 5,
          backgroundColor: theme.colors.white,
          alignSelf: "center",
          maxWidth : 500 ,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        listItemTitle:theme.fonts.bodyLarge
  
      });


  return (
    <List.Item title={item?.batch_name} titleEllipsizeMode="tail"
            titleNumberOfLines={2}  
            style={styles.listItem}
            titleStyle={styles.listItemTitle} 
            onPress={()=>navigator.push("SubjectAttendance" , {title : item.batch_name , lectures : item.lectures})}
            right={(props)=>{
              const present = item.lectures.filter(item=>item.attendance==1).length
              const total = item.lectures.length
              
              return(<>
              <Text variant='bodyMedium' style={{alignSelf:"center"}}>{present}/{total}</Text>
              <Icon name="arrow-right" color={theme.colors.black} style={{alignSelf:"center", marginLeft:10}} size={25} />
              </>
              )
            }}
            left={(props)=>{
              const present = item.lectures.filter(item=>item.attendance==1).length
              const total = item.lectures.length
              const percent = (present/total)*100
              let color:ProgressColorProp = 'green'
              if ( percent < 75) color = 'blue'
              if ( percent < 50) color = 'red'

              return (
              <ProgressCustom
                size={50}
                width={3}
                fill={percent?percent:5}
                color={color}
                style={{marginLeft:15}}
              >
                {(fill)=><>
                <Text numberOfLines={2} ellipsizeMode='tail' variant='labelSmall' style={{flexWrap:"wrap", color:theme.colors.black , textAlign:"center"}} >{Math.round(percent)||0}%</Text>
                </>
                }
              </ProgressCustom>
            )}}
          />
  )
}

export default ItemList

const styles = StyleSheet.create({})