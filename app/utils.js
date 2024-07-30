import customTheme from "./theme";

export function getColorByPercent(percent , bg=false ){
    let color = bg?customTheme.colors.container_green:customTheme.colors.green;
    if ( percent < 75 ) color = bg?customTheme.colors.container_background:customTheme.colors.blue;
    if ( percent < 50 ) color = bg?customTheme.colors.container_red:customTheme.colors.red;
    return color
}