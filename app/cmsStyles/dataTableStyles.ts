import { StyleSheet } from "react-native";

const dataTableStyles=StyleSheet.create({
    headerStyle: {
        // borderTopWidth: 1,
        borderBottomWidth: 2,
        height: 50,
        alignItems: 'center',
        justifyContent:"center",
        paddingHorizontal: 3,
      },
      headerTextStyle:{
        fontWeight:"700",
      },
      rowStyle : {
        gap: 25,
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingHorizontal: 3,
        justifyContent : 'center',
        alignItems:"center"
      },
})


export default  dataTableStyles;