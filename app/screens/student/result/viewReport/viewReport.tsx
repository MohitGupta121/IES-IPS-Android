import {
  BackHandler,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {studentApi} from '../../../../api/API';
import {
  Text,
  ActivityIndicator,
  useTheme,
  DataTable,
  Tooltip,
  Card,
} from 'react-native-paper';
import {themeType} from '../../../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {studentActionTypes} from '../../../../redux/student/types';
import NoData from '../../../../components/noData';
import {useNavigation, useRoute} from '@react-navigation/native';
import CMScard from '../../../../components/cms_card';
import {getColorByPercent} from '../../../../utils';
import {PieColorRange} from '../../../../constants';
import {PieChart} from 'react-native-gifted-charts';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../../routes/routes';

const ViewReport = () => {
  const theme: themeType = useTheme();
  const window = useWindowDimensions();
  const styles = StyleSheet.create({
    headerText: {
      color: theme.colors.black,
      fontSize: 15,
      fontWeight: '700',
    },
    headerStyle: {
      gap: 25,
      // borderTopWidth: 1,
      borderBottomWidth: 2,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      paddingHorizontal: 3,
    },
    tableViewStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      margin: 5,
      padding: 5,
      alignSelf: 'center',
    },
    ScrollStyle : {
      marginTop: 50,
      maxWidth: '100%',
      alignSelf: 'center',
    }
  });
  // @ts-ignore
  const user = useSelector(store => store.common.User.user);
  const dispatch = useDispatch();
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const params: any = useRoute().params;
  useBackHandler(()=>{
    navigator.pop();
    return true;
  })

  type pieData = {
    value : number,
    color : string,
    label : string,
  }

  useEffect(() => {
    navigator.setOptions({title: params.type});
    let newPieData:pieData[] = [];
    Object.keys(params.report).map((item, index) => {
      let total = params.report[item].total;
      let obtain = params.report[item].obtain;
      let percent = Math.round((obtain / total) * 100);
      newPieData.push({
        value: percent,
        color: PieColorRange[index],
        label: item,
      });
      setPieData([...newPieData]);
    });
  }, [params]);

  const [pieData, setPieData] = useState<pieData[]>([]);
  const report: Record<string, {obtain: number; total: number}> = params.report;

  const obtainScoresSum = Object.values(report).reduce(
    (accumulator, currentValue) => accumulator + currentValue.obtain,
    0,
  );
  const maximumScoresSum = Object.values(report).reduce(
    (accumulator, currentValue) => accumulator + currentValue.total,
    0,
  );

  return (
    <ScrollView style={styles.ScrollStyle} contentContainerStyle={{paddingBottom : 50}}>
      <View style={{padding: 10}}>
        <Text variant="headlineSmall"> Exam Performance</Text>
      </View>
      <CMScard style={{gap: 10, maxWidth: 500}}>
        <View
          style={{
            flex: 1,
            borderRightWidth: 2,
            borderColor: theme.colors.primary,
          }}>
          <Text variant="titleMedium">{params.type} Percentage</Text>
          <Text variant="labelMedium" style={{color: theme.colors.primary}}>
            {obtainScoresSum}/{maximumScoresSum}
          </Text>
        </View>
        <Text variant="displaySmall" style={{color: theme.colors.primary}}>
          {params.percentage}%
        </Text>
      </CMScard>
      <PerformancePie data={pieData} overallPercent={params.percentage} />
      <View style={{padding: 10}}>
        <Text variant="headlineSmall"> Result</Text>
      </View>
      {/* <CMScard style={{padding:2}}> */}
      <ScrollView horizontal style={styles.tableViewStyle}>
        <DataTable>
          <DataTable.Header style={styles.headerStyle}>
            <View style={{width: '15%'}}>
              <Text
                variant='titleMedium'
                numberOfLines={1}
                >
                S.No.
              </Text>
            </View>
            <View style={{width: '60%'}}>
              <Text
                variant='titleMedium'
                numberOfLines={1}
                >
                Subject
              </Text>
            </View>
            {/* <View textStyle={styles.headerText} style={{width : 80}}  numeric>Max Marks</View> */}
            <View style={{width: '12%'}}>
              <Text
                variant='titleMedium'
                numberOfLines={2}
                >
                Marks
              </Text>
            </View>
            {/* <View textStyle={styles.headerText} style={{width : 80}}  numeric>Total {'(%)'}</View> */}
          </DataTable.Header>
          {Object.keys(params.report).map((item, index) => {
            let total = params.report[item].total;
            let obtain = params.report[item].obtain;
            let percent = Math.round((obtain / total) * 100);
            return (
              <DataTable.Row
                key={index}
                style={[
                  {gap: 15},
                  {
                    backgroundColor:
                      index % 2 == 0
                        ? 'theme.color.container_background'
                        : '#c8d9f0',
                  },
                ]}>
                <View style={{width: '10%', justifyContent: 'center'}}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={{width: '80%', justifyContent: 'center'}}>
                  <Text numberOfLines={2}>{item}</Text>
                </View>
                {/* <DataTable.Cell style={{width : 80}} numeric>{total}</DataTable.Cell> */}
                <View style={{width: '10%',alignItems:'flex-end', justifyContent : 'center'}}>
                  <Text>{obtain}/{total}</Text>
                </View>
                {/* <DataTable.Cell style={{width : 80}} textStyle={{color:getColorByPercent(percent)}} numeric>{percent}%</DataTable.Cell> */}
              </DataTable.Row>
            );
          })}
        </DataTable>
      </ScrollView>
      {/* </CMScard> */}
    </ScrollView>
  );
};
const ColorRepresent = (props: any) => {
  return (
    <View
      style={{
        height: props.size,
        width: props.size,
        backgroundColor: props.color,
        // alignSelf:"center",
        borderRadius: 200,
        marginTop: 5,
      }}></View>
  );
};

const PerformancePie = (props: any) => {
  const theme: themeType = useTheme();
  const style = StyleSheet.create({
    pieContianer: {
      padding: 20,
      alignSelf: 'center',
    },
    mainContainer: {},
    dataDots: {
      alignSelf: 'center',
      flexWrap: 'wrap',
      columnGap: 500,
      flexDirection: 'column',
      margin: 20,
      marginHorizontal: 10,
      padding: 20,
      justifyContent: 'space-between',
      // maxWidth: 350
    },
  });

  const [centerPercent , setCenterPercent]= useState(props.overallPercent);

  function getGreet(percent) {
    if (percent > 85) return 'Excellent';
    if (percent > 70) return 'Very Good';
    if (percent > 60) return 'Good';
    if (percent > 33) return 'Pass';
    else return 'Fail';
  }

  return (
    <View style={style.mainContainer}>
      {/* <Text style={{fontWeight:"bold" ,padding:30}} variant='bodyLarge'>Score Chart</Text> */}
      <CMScard>
        <Card.Title title="Score Chart" titleVariant='headlineMedium'  />
        <View style={style.pieContianer}>
          <PieChart
            donut
            data={props.data}
            radius={90}
            innerRadius={60}
            onPress={(item , index )=>setCenterPercent(item.value)}
            focusOnPress
            // showGradient
            showText
            centerLabelComponent={() => {
              return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                    {centerPercent}%
                  </Text>
                  <Text style={{fontSize: 14}}>
                    {getGreet(centerPercent)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View style={style.dataDots}>
          {props.data.map((item, index) => (
            <View
              style={{flexDirection: 'row', gap: 5, width: '100%'}}
              key={index}>
              <ColorRepresent color={item.color} size={10} />
              <Text variant="bodyMedium" ellipsizeMode="tail">
                {item.label}
              </Text>
              <Text variant="bodyMedium">({item.value}%)</Text>
            </View>
          ))}
        </View>
      </CMScard>
    </View>
  );
};

export default ViewReport;
