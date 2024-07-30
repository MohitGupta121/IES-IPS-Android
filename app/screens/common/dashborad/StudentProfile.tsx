import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { memo } from 'react'
import { themeType } from '../../../theme';
import { useTheme  , Text, DataTable} from 'react-native-paper';
import CMScard from '../../../components/cms_card';
import  Icon  from 'react-native-vector-icons/Feather';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';

const StudentProfile = ({user}) => {
    const window = useWindowDimensions();
    const theme:themeType = useTheme();
    
    const styles = StyleSheet.create({
      ...dataTableStyles,
        tableCellStyle : {
          justifyContent: 'center',
          flex: 1,
          alignSelf : "flex-start"
        },
        tableRowStyle : {
          minHeight : "auto",
          borderBottomWidth : 0,
          paddingHorizontal : 10,
        },
    })
    



  return (
    <View style={{
        flex: 1,
        paddingBottom: 30,
        // display : profile?"flex" : "none",
        }}>
                    <CMScard
                      style={{
                        marginVertical : 2.5,
                        width: window.width - 40,
                        maxWidth : 460,
                        justifyContent: 'flex-start',
                        gap: 20,
                        borderBottomLeftRadius : 0,
                        borderBottomRightRadius : 0,
                      }}>
                      <Icon
                        name="user"
                        size={30}
                        color={theme.colors.primary}
                      />
                      <View style={{flexDirection: 'column', flex : 1 ,}}>
                        <Text variant="titleLarge">Basic Info </Text>
                        <DataTable style={{gap : 5}}>
                          <DataTable.Row style={styles.tableRowStyle}>
                            <View style={[{maxWidth : 60},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">Name</Text>
                            </View>
                            <View style={[{maxWidth : 20 , alignItems:"center"},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">:</Text>
                            </View>
                            <View style={[{flex : 1},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">{user?.name || ''}</Text>
                            </View>
                          </DataTable.Row>
                          <DataTable.Row style={styles.tableRowStyle}>
                            <View style={[{maxWidth : 60},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">Father</Text>
                            </View>
                            <View style={[{maxWidth : 20 , alignItems:"center"},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">:</Text>
                            </View>
                            <View style={[{flex : 1},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">{user?.father_name || ''}</Text>
                            </View>
                          </DataTable.Row>
                          <DataTable.Row style={styles.tableRowStyle}>
                            <View style={[{maxWidth : 60},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">Mother</Text>
                            </View>
                            <View style={[{maxWidth : 20 , alignItems:"center"},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">:</Text>
                            </View>
                            <View style={[{flex : 1},styles.tableCellStyle]}>
                              <Text variant="bodyLarge">{user?.mother_name || ''}</Text>
                            </View>
                          </DataTable.Row>
                          {/* <Text variant="bodyLarge">Father : {user?.father_name || ''}</Text> */}
                          {/* <Text variant="bodyLarge">Mother : {user?.mother_name || ''}</Text> */}
                        </DataTable>
                      </View>
                    </CMScard>
                    <CMScard
                      style={{
                        marginVertical : 2.5,
                        width: window.width - 40,
                        maxWidth : 460,
                        justifyContent: 'flex-start',
                        gap: 20,
                        flexWrap: 'nowrap',
                        borderRadius : 0,
                      }}>
                      <Icon
                        name="at-sign"
                        size={30}
                        color={theme.colors.primary}
                      />
                      <View style={{flexDirection: 'column', flex : 1}}>
                        <Text variant="titleLarge">Email </Text>
                        <View style={{paddingHorizontal : 10}}><Text variant="bodyLarge">{user?.email || ''}</Text></View>
                        
                      </View>
                    </CMScard>
                    <CMScard
                      style={{
                        marginVertical : 2.5,
                        width: window.width - 40,
                        maxWidth : 460,
                        justifyContent: 'flex-start',
                        gap: 20,
                        flexWrap: 'nowrap',
                        borderRadius : 0,
                      }}>
                      <Icon
                        name="home"
                        size={30}
                        color={theme.colors.primary}
                      />
                      <View style={{flexDirection: 'column', flex : 1}}>
                        <Text variant="titleLarge">Address </Text>
                        <View style={{paddingHorizontal : 10}}><Text variant="bodyLarge" >{user?.address || ''}</Text></View>
                      </View>
                    </CMScard>
                    <CMScard
                      style={{
                        marginVertical : 2.5,
                        width: window.width - 40,
                        maxWidth : 460,
                        justifyContent: 'flex-start',
                        gap: 20,
                        flexWrap: 'nowrap',
                        borderTopLeftRadius : 0,
                        borderTopRightRadius : 0,
                      }}>
                      <Icon
                        name="phone"
                        size={30}
                        color={theme.colors.primary}
                      />
                      <View style={{flexDirection: 'column', flex : 1}}>
                        <Text variant="titleLarge">Contact Details </Text>
                        <DataTable style={{gap:5}} >
                          
                          <DataTable.Row style={styles.tableRowStyle}>
                            <View style={[{maxWidth : 80} , styles.tableCellStyle]}>
                              <Text>Mobile No.</Text>
                            </View>
                            <View style={[{maxWidth : 20 , alignItems:"center"} , styles.tableCellStyle]}>
                              <Text>:</Text>
                            </View>
                            <View style={[{flex : 1} , styles.tableCellStyle]}>
                              <Text>{user?.student_mobile || ''}</Text>
                            </View>
                          </DataTable.Row>
                          <DataTable.Row style={styles.tableRowStyle}>
                            <View style={[{maxWidth : 80} , styles.tableCellStyle]}>
                              <Text>Email</Text>
                            </View>
                            <View style={[{maxWidth : 20 , alignItems:"center"} , styles.tableCellStyle]}>
                              <Text>:</Text>
                            </View>
                            <View style={[{flex : 1} , styles.tableCellStyle]}>
                              <Text>{user?.email || ''}</Text>
                            </View>
                          </DataTable.Row>

                        </DataTable>
                      </View>
                    </CMScard>
                  </View>
  )
}

export default memo(StudentProfile)
