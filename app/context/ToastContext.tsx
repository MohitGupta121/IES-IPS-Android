import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import useToastConfig from '../hooks/toastConfig';
import { themeType } from '../theme';
import { useTheme } from 'react-native-paper';
import useCollapsibleCustomHeader from '../hooks/useCollapsibleHeader';


const ToastContextProvider = ({children}) => {
    const theme:themeType = useTheme();
    const toastConfig = useToastConfig(theme);
    const { headerHeight }  = useCollapsibleCustomHeader()
  return (
    <ToastProvider
        placement="top"
        duration={6000}
        offset={headerHeight}
        renderType={toastConfig}
        renderToast={toastConfig.success}>
        {children}
    </ToastProvider>
  )
}

export default ToastContextProvider