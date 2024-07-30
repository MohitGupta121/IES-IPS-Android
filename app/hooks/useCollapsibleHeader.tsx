import { useCallback, useContext, useEffect, useState } from "react";
import { HeaderContext } from "../context/headerCollapse";
import { NativeScrollEvent, NativeSyntheticEvent, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function useCollapsibleCustomHeader(){
    var {value:headerY , setHidden , hidden} = useContext(HeaderContext);

    useEffect(()=>{
        headerY?headerY.value = 0:null;
        setHidden(false);
    },[headerY])


    const insets = useSafeAreaInsets();
    const headerCheckHiddenValue = -50 -(StatusBar.currentHeight || 0);

    var headerHeight = 50;
    if ( Platform.OS == "android") headerHeight = 50;
    else  {
        headerHeight = 50;
    }


    const onScroll = useCallback((event:NativeSyntheticEvent<NativeScrollEvent>)=>{
        if(headerY){
            if ( event.nativeEvent.contentOffset.y > 50){
                if ( Platform.OS == "android")headerY.value = -50 -(StatusBar.currentHeight || 0) ;
                else headerY.value = -50 -insets.top
                setHidden(true);

            }
            else {
                headerY.value = -event.nativeEvent.contentOffset.y;
                setHidden(false);

            }

        }
            
    },[headerY])

    const collapse = useCallback( ()=>{
        if(headerY){
            headerY.value = -50 -(StatusBar.currentHeight || 0) ;
            setHidden(true);
        }
    }, [headerY])
    const expand = useCallback( ()=>{
        if(headerY){
            headerY.value = 0 ;
            setHidden(false);
        }
    }, [headerY])

    return {onScroll , headerCheckHiddenValue , headerHeight , expand ,collapse};
}