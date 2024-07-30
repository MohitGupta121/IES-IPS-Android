import { View, Text, useWindowDimensions, StyleSheet, ScrollView } from 'react-native'
import { themeType } from '../../../theme';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetAssignedFacultiesByApplyId } from '../../../hooks/query/staff';
import CustomLoading from '../../../components/customLoading';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import { useBackHandler } from '@react-native-community/hooks';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';

const ViewFacultyAssigned = () => {
    const theme: themeType = useTheme();
    const dimension = useWindowDimensions();

    const params  = useRoute<any>()?.params; 
    const apply_id = params?.apply_id;

    const styles = StyleSheet.create({
        rootContainer: {
            flex: 1,
          },
          scrollViewcontainer: {
            gap: 20,
            paddingVertical: 30,
            paddingBottom:100
          },
          cardStyle: {
            gap: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.2,
            shadowRadius: 13.16,
      
            elevation: 20,
            // width: dimension.width - 30,
            maxWidth: 500,
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 30,
            flexDirection: 'column',
            // marginVertical: 'auto',
            // backgroundColor: theme.colors.container_background
          },
          cardHeading: {
            fontWeight: '700',
            color: theme.colors.primary,
            textAlign: 'center',
          },
    });

    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const {headerHeight, onScroll} = useCollapsibleCustomHeader();

    
    useBackHandler(() => {
        navigator.pop();
        return true;
    });

    const {facultyAssigned , queryState:{isLoading}} = useGetAssignedFacultiesByApplyId(apply_id);

    if ( isLoading) return <CustomLoading />


  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView
        style={styles.rootContainer}
        onScroll={onScroll}
        contentContainerStyle={[styles.scrollViewcontainer , {paddingTop: headerHeight}]}>
            
        </ScrollView>
    </GestureHandlerRootView>
  )
}

export default ViewFacultyAssigned