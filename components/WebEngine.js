import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RenderHTMLConfigProvider, TRenderEngineProvider, TRenderEngineConfig } from 'react-native-render-html';
import { findOne } from 'domutils';

const selectDomRoot = (node) =>
  findOne((e) => e.name === "article", node.children, true);

const ignoredDomTags = ["button"];
const WebEngine = (props) => {
  return (
    <TRenderEngineProvider ignoredDomTags={ignoredDomTags} selectDomRoot={selectDomRoot}>
        <RenderHTMLConfigProvider enableExperimentalMarginCollapsing>
            {props.children}
        </RenderHTMLConfigProvider>
    </TRenderEngineProvider>
  )
}

export default WebEngine

const styles = StyleSheet.create({})