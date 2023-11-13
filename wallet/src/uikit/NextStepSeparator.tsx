// FIXME: Move file when Avatar and LightArrowDown3 are moved

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar } from './Avatar'
import { LightArrowDown3 } from './Icon/LightArrowDown3'

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        height: 0,
    },
})

export const NextStepSeparator = () => {
    return (
        <View style={styles.container}>
            <Avatar
                backgroundColor="surfaceDefault"
                border="secondary"
                size={28}
                icon={<LightArrowDown3 color="iconDefault" size={16} />}
            />
        </View>
    )
}
