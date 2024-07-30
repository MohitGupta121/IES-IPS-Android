import React, { useMemo } from 'react';
import {useWindowDimensions, View} from 'react-native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import CMScard from '../../../components/cms_card';
import {StyleSheet} from 'react-native';
import {themeType} from '../../../theme';
import {Text, useTheme} from 'react-native-paper';
import Animated, { ZoomIn, ZoomInEasyUp, ZoomInUp } from 'react-native-reanimated';
import { useGetLeaveBalance } from '../../../hooks/query/staff';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import { useAcademicSession } from '../../../hooks/query/common';
import { reducerData } from '../../../redux/common/reducer';
import { CartesianChart, Bar, Line } from "victory-native";
import {Canvas, Circle, Group, LinearGradient, vec , useFont} from "@shopify/react-native-skia";
import Sans from "../../../assets/fonts/DMSans-Italic-VariableFont_opsz,wght.ttf"
import { useFocusEffect } from '@react-navigation/native';


const Leavesummary = () => {
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();
  const styles = StyleSheet.create({
    headingsFont: {
      paddingLeft: 20,
      lineHeight: 30,
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.black,
    },
    cardStyle: {alignItems: 'baseline', flex: 1, minWidth: '90%' },
  });

  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});
  const faculty_computer_code = user.computer_code;
  const {current_academic_session_id:current_session} = useAcademicSession();

  const {leaveBalance , queryState:{refetch}} = useGetLeaveBalance(current_session , faculty_computer_code);

  const barData = useMemo(()=>([
    {value: leaveBalance.cl+0.1, label: 'CL'},
    {value: leaveBalance.el+0.1, label: 'EL'},
    {value: leaveBalance.ol+0.1, label: 'OL'},
    {value: leaveBalance.dl+0.1, label: 'DL'},
  ]) , [leaveBalance]);

  const font = useFont(Sans);



  return (
    <View
      style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1, height: 400}}>
      {/* <PieChart
          donut
          data={[
            {value: 5, color: 'green' },
            {value: 20, color: 'blue' },
            {value: 15, color: 'pink'  },
            {value: 10, color: 'yellow' },
            {value: 10, color: 'grey' },
            {value: 15, color: 'orange' },
            {value: 25, color: 'black' },
          ]}
          radius={80}
          innerRadius={55}
          // onPress={(item , index )=>setCenterPercent(item.value)}
          focusOnPress
          // showGradient
          showText
          centerLabelComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>25/50</Text>
                <Text style={{fontSize: 14}}>Leaves</Text>
              </View>
            );
          }}
        />
        <PieChart
          donut
          data={[
            {value: 5, color: 'green' },
            {value: 20, color: 'blue' },
            {value: 15, color: 'pink'  },
            {value: 10, color: 'yellow' },
            {value: 10, color: 'grey' },
            {value: 15, color: 'orange' },
            {value: 25, color: 'black' },
          ]}
          radius={60}
          innerRadius={40}
          // onPress={(item , index )=>setCenterPercent(item.value)}
          focusOnPress
          // showGradient
          showText
          centerLabelComponent={() => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>25/50</Text>
                <Text style={{fontSize: 14}}>Leaves</Text>
              </View>
            );
          }}
        /> */}
      {/* <BarChart
          horizontal
          barWidth={22}
          barBorderRadius={4}
          data={barData}
          yAxisThickness={0}
          xAxisThickness={2}
          color={theme.colors.black}
          width={400}
          topLabelTextStyle={{color:theme.colors.black}}
          yAxisLabelTextStyle={{color:theme.colors.black}}
          xAxisLabelTextStyle={{color:theme.colors.black}}
          // barStyle={{backgorundColor:theme.colors.black}}
      /> */}

      <View style={{flex: 1, padding: 20 }}>
        <CartesianChart
          data={barData}
          xKey="label"
          yKeys={['value']}
          axisOptions={{
            labelColor: {x:theme.colors.black , y:theme.colors.black},
            isNumericalData: true,
            labelOffset: {x:10 , y :10},
            labelPosition:{ x:'outset' , y:'outset' },
            lineColor:{
              grid:{
                x:theme.colors.backdrop,
                y:theme.colors.backdrop,
              },
              frame:theme.colors.black
            },
            font:font,
            tickCount:{
              x : 4,
              y: 10
            }
          }}
          domain={{x:[-0.75 , 4] , y:[0]}}
          
          >
          {({points, chartBounds}) => (
              <Bar
                points={points.value}
                chartBounds={chartBounds}
                color={theme.colors.primary}
                roundedCorners={{topLeft: 10, topRight: 10}}
                barWidth={50}
                animate={{
                  type:"timing",
                  duration:1000,
                }}
              />
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

export default Leavesummary;
