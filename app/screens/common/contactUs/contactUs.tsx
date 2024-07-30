import {BackHandler, StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {useEffect} from 'react';
import {Text, useTheme, DataTable} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import CMScard from '../../../components/cms_card';
import Icon from 'react-native-vector-icons/Feather';
import {ThemeColors} from 'react-navigation';
import {themeType} from '../../../theme';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';

const ContactUs = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme: themeType = useTheme();
  const window = useWindowDimensions();

  const styles = StyleSheet.create({
    tableCellStyle: {
      justifyContent: 'center',
      flex: 1,
      alignSelf: 'flex-start',
    },
    tableRowStyle: {
      minHeight: 'auto',
      borderBottomWidth: 0,
      paddingHorizontal: 10,
    },
  });

  useBackHandler(()=>{
    navigator.pop();
    return true;
  })
  
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        minHeight: window.height - 50,
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
      }}>
      <CMScard
        style={{
          marginVertical: 2.5,
          width: window.width - 50,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          justifyContent: 'flex-start',
          gap: 20,
          flexWrap: 'nowrap',
        }}>
        <Icon name="map-pin" size={30} color={theme.colors.primary} />
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text variant="titleLarge">Address </Text>
          <View style={{paddingHorizontal: 10}}>
            <Text variant="bodyLarge">
              IPS Academy, Institute of Engineering & Science, Knowledge
              Village, Rajendra Nagar A.B. Road, Indore-452012
            </Text>
          </View>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginVertical: 2.5,
          borderRadius: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          gap: 20,
          flexWrap: 'nowrap',
        }}>
        <Icon name="phone" size={30} color={theme.colors.primary} />
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text variant="titleLarge">Contact number </Text>
          <View style={{paddingHorizontal: 10}}>
            <Text variant="bodyLarge">0731-4014601</Text>
          </View>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginVertical: 2.5,
          borderRadius: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          gap: 20,
          flexWrap: 'nowrap',
        }}>
        <Icon name="at-sign" size={30} color={theme.colors.primary} />
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text variant="titleLarge">Email </Text>
          <View style={{paddingHorizontal: 10}}>
            <Text variant="bodyLarge">office.ies@ipsacademy.org</Text>
          </View>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginVertical: 2.5,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          gap: 20,
          flexWrap: 'nowrap',
        }}>
        <Icon name="globe" size={30} color={theme.colors.primary} />
        <View style={{flexDirection: 'column', flex: 1}}>
          <Text variant="titleLarge">Office </Text>
          <View style={{paddingHorizontal: 10}}>
            <Text variant="bodyLarge">0731-4014602</Text>
          </View>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginBottom: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          
        }}>
        <View style={{flexDirection: 'column', flex: 1, gap: 20}}>
          <Text variant="titleLarge">For Counselling: - </Text>
          <DataTable style={{gap: 5}}>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 70}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Incharge</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Prof. Ashwini Joshi</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Phone/Mob. No</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">
                  {' '}
                  0731-4014603, 604, 07746000161, 9977906161, 09826953449
                </Text>
              </View>
            </DataTable.Row>
          </DataTable>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginBottom: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          
        }}>
        <View style={{flexDirection: 'column', flex: 1,gap: 20,}}>
          <Text variant="titleLarge">
            Discipline and Anti Ragging Committee: -
          </Text>
          <DataTable style={{gap: 10}}>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Incharge</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> Dr. Manish Sahajwani</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Phone No.</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> 0731-4014611 / 9826763019</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Email Address</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> hod.elec-elex@ipsacademy.org</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Convener </Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> Mr. Rahul Sharma</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Phone No.</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> 9926422399</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Email Address</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">rahulsharma@ipsacademy.org</Text>
              </View>
            </DataTable.Row>
          </DataTable>
        </View>
      </CMScard>

      <CMScard
        style={{
          marginBottom: 0,
          width: window.width - 50,
          justifyContent: 'flex-start',
          
        }}>
        <View style={{flexDirection: 'column', flex: 1,gap: 20,}}>
          <Text variant="titleLarge">Internal Complaint Committee : -</Text>
          <DataTable style={{gap: 5}}>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 70}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Phone No.</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">0731-4014645</Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.tableRowStyle}>
              <View style={[{maxWidth: 80}, styles.tableCellStyle]}>
                <Text variant="bodyLarge">Email Address</Text>
              </View>
              <View
                style={[
                  {maxWidth: 20, alignItems: 'center'},
                  styles.tableCellStyle,
                ]}>
                <Text variant="bodyLarge">:</Text>
              </View>
              <View style={[{flex: 1}, styles.tableCellStyle]}>
                <Text variant="bodyLarge"> hod.compsc@ipsacademy.org</Text>
              </View>
            </DataTable.Row>
          </DataTable>
        </View>
      </CMScard>
    </ScrollView>
  );
};

export default ContactUs;

const styles = StyleSheet.create({});
