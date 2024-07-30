import { Dimensions, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { themeType } from '../../../theme';
import MenuList from './MenuList';
import { useTheme } from 'react-native-paper';

type menuProp = {
    open : boolean,
    changeOpen : any
}


const MenuBottomSheet = (props : menuProp) => {
    const theme:themeType = useTheme();
  const Modalref: any = useRef<BottomSheet>(null);

  useEffect(()=>{
    if ( props.open) Modalref.current.present();
    else Modalref.current.dismiss();
  },[props.open])

  const window = useWindowDimensions();

  const backdrop = useCallback((backdropProps:BottomSheetBackdropProps)=>(
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
  ) , [])

  return (
     <BottomSheetModal
              ref={Modalref}
              index={0}
              snapPoints={[310]}
              enableDismissOnClose
              handleIndicatorStyle={{
                backgroundColor: theme.colors.primary,
                width: 100,
                height: 5,
              }}
              onDismiss={()=>props.changeOpen(false)}
              backdropComponent={backdrop}
              >
              <View style={{padding: 10}}>
                <MenuList Modalref={Modalref} />
              </View>
            </BottomSheetModal>
  )
}

export default MenuBottomSheet
