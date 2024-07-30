import { View, Linking , ScrollView, StyleSheet, useWindowDimensions, Image } from 'react-native'
import {DataTable, Divider, Text, useTheme} from 'react-native-paper'
import { MarkdownView } from 'react-native-markdown-view'
import {
    Cell,
    Grid,
    Row,
  } from 'react-native-tabular-grid-markdown-view'
import { themeType } from '../theme'


const MarkDownCustom = ({children}) => {

    const theme:themeType = useTheme();
    const dimension = useWindowDimensions();
    const customStyle = StyleSheet.create({
        tableCell:{
            borderWidth:1,
            borderColor: theme.colors.backdrop,
            padding:5
        },
        tableScrollView:{
            padding:10
        },
        imgContainer:{
            flex:1,
            alignSelf:"stretch",
            alignItems:"center",
        },
        link:{
            color:theme.colors.primary,
            textDecorationLine:"underline",
        }
    })

    const markDownStyles = {
      paragraph: {
        color: theme.colors.black,
        fontSize:16,
        },
      heading: {
        color: theme.colors.black
        },
    };



  return (
    <MarkdownView
      styles={markDownStyles}
      onLinkPress={url => {
        Linking.openURL(url).catch(error =>
          console.warn('An error occurred: ', error),
        );
      }}
      rules={{
        list: {
          render: (node, output, state, styles) => {return (
            <View key={state.key} style={styles.list}>
              {node.items.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  {node.ordered ? (
                    <Text variant='bodyMedium' style={styles.listItemNumber}>{`${i + 1}.`}</Text>
                  ) : (
                    <Text style={styles.listItemBullet}>
                      {styles.listItemBullet && styles.listItemBullet.content
                        ? styles.listItemBullet.content
                        : '⚬'}
                    </Text>
                  )}
                  <Text
                  variant='bodyMedium' 
                    style={
                      node.ordered
                        ? styles.listItemOrderedContent
                        : styles.listItemUnorderedContent
                    }>
                    {output(item, state).map(item => {
                      if (item.type?.displayName == 'Text') {
                        return item;
                      } else {
                        return null;
                      }
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )},
        },

        table:{
            render:(node, output, state, styles) => { 
                

                function renderTableCell(cell, row, column, rowCount, columnCount, output, state, styles) {
                    const cellStyle = [styles.tableCell]
                    const contentStyle = [styles.tableCellContent]
                  
                    if (row % 2 == 0) {
                      cellStyle.push(styles.tableCellEvenRow)
                      contentStyle.push(styles.tableCellContentEvenRow)
                    } else {
                      cellStyle.push(styles.tableCellOddRow)
                      contentStyle.push(styles.tableCellContentOddRow)
                    }
                  
                    if (column % 2 == 0) {
                      cellStyle.push(styles.tableCellEvenColumn)
                      contentStyle.push(styles.tableCellContentEvenColumn)
                    } else {
                      cellStyle.push(styles.tableCellOddColumn)
                      contentStyle.push(styles.tableCellContentOddColumn)
                    }
                  
                    if (row == 1) {
                      cellStyle.push(styles.tableHeaderCell)
                      contentStyle.push(styles.tableHeaderCellContent)
                    } else if (row == rowCount) {
                      cellStyle.push(styles.tableCellLastRow)
                      contentStyle.push(styles.tableCellContentLastRow)
                    }
                  
                    if (column == columnCount) {
                      cellStyle.push(styles.tableCellLastColumn)
                      contentStyle.push(styles.tableCellContentLastColumn)
                    }
                  
                    return <View style={customStyle.tableCell} >
                      <Text  selectable selectionColor={theme.colors.container_background} variant='labelLarge' >
                        {output(cell, state)}
                      </Text>
                    </View>
                  }
                function renderTablHeaderCell(cell, row, column, rowCount, columnCount, output, state, styles) {
                    const cellStyle = [styles.tableCell]
                    const contentStyle = [styles.tableCellContent]
                  
                    if (row % 2 == 0) {
                      cellStyle.push(styles.tableCellEvenRow)
                      contentStyle.push(styles.tableCellContentEvenRow)
                    } else {
                      cellStyle.push(styles.tableCellOddRow)
                      contentStyle.push(styles.tableCellContentOddRow)
                    }
                  
                    if (column % 2 == 0) {
                      cellStyle.push(styles.tableCellEvenColumn)
                      contentStyle.push(styles.tableCellContentEvenColumn)
                    } else {
                      cellStyle.push(styles.tableCellOddColumn)
                      contentStyle.push(styles.tableCellContentOddColumn)
                    }
                  
                    if (row == 1) {
                      cellStyle.push(styles.tableHeaderCell)
                      contentStyle.push(styles.tableHeaderCellContent)
                    } else if (row == rowCount) {
                      cellStyle.push(styles.tableCellLastRow)
                      contentStyle.push(styles.tableCellContentLastRow)
                    }
                  
                    if (column == columnCount) {
                      cellStyle.push(styles.tableCellLastColumn)
                      contentStyle.push(styles.tableCellContentLastColumn)
                    }
                  
                    return <View style={customStyle.tableCell} >
                      <Text variant='titleSmall' style={{textAlign:"center"}} >
                        {output(cell, state)}
                      </Text>
                    </View>
                  }

                
                
                return (
                    <ScrollView contentContainerStyle={customStyle.tableScrollView} horizontal>
                <Grid key={state.key} >
                  {[<Row id={1} key={1}>
                    {node.header.map((cell, column) => renderTablHeaderCell(cell, 1, column + 1, node.cells.length + 1, node.header.length, output, state, styles))}
                  </Row>].concat(node.cells.map((cells, row) => (
                    <Row id={row + 2} key={row + 2}>
                      {cells.map((cell, column) => renderTableCell(cell, row + 2, column + 1, node.cells.length + 1, cells.length, output, state, styles))}
                    </Row>
                  )))}
                </Grid>
                </ScrollView>
              )}
        },

        image:{
            render:(node, output, state, styles)=>{
                const {imageWrapper: wrapperStyle, image: imageStyle} = styles
                function paddedSize(size, style) {
                    function either(a, b) {
                      return a === undefined ? b : a
                    }
                }
                return (
                    <View style={customStyle.imgContainer}>
                  <View key={state.key} style={node.width && node.height ? [wrapperStyle, paddedSize(node, wrapperStyle)] : wrapperStyle}>
                    <Image source={{uri: node.target}} width={undefined} height={undefined} style={[imageStyle , {borderRadius:20}]}/>
                  </View>
                  </View>
                )
              }
        },

        link:{
            render:(node, output, state, styles) => {
                const onPress = state.onLinkPress
                return <Text key={state.key} style={customStyle.link} onPress={onPress ? () => onPress(node.target) : null}>
                  {typeof node.content === 'string' ? node.content : output(node.content, state)}
                </Text>
              },
        },

        
      }}
      
      >
        {children}
      </MarkdownView>
  );
}




export default MarkDownCustom