import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { createContext } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'


export const HeaderContext = createContext<{value: null|SharedValue<number> ,hidden : boolean , setHidden:(prevalue:any)=>void}>({value : null , hidden : false,setHidden: (value)=>null})
const HeaderCollapseContext = ({children}) => {
    const value = useSharedValue(0);
    const [hidden , setHidden ] = useState(false)
  return (
    <HeaderContext.Provider value={{value ,hidden , setHidden}} >
        {children}
    </HeaderContext.Provider>
  )
}

export default HeaderCollapseContext