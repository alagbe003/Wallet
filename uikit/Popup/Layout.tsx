import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Extractor } from '../Extractor'
import { Modal } from '../Modal'
import { colors } from '../colors'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.backgroundOverlay,
    },
    stopper: {
        minHeight: 56,
        flexShrink: 0,
        flexGrow: 1,
        width: '100%',
        cursor: 'auto',
    },
    dynamic: {
        flexDirection: 'column',
        overflow: 'hidden',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 24,
        flexShrink: 1,
    },
    contentContainer: {
        flexDirection: 'column',
        flex: 1,
        rowGap: 24,
    },
    background_surfaceDefault: {
        backgroundColor: colors.surfaceDefault,
    },
    background_backgroundLight: {
        backgroundColor: colors.backgroundLight,
    },
})

type Props = {
    children: React.ReactNode
    background?: Extractor<keyof typeof styles, 'background'>
    'aria-labelledby'?: string
    'aria-describedby'?: string
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Layout = ({
    children,
    background = 'backgroundLight',
    onMsg,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
}: Props) => (
    <Modal aria-labelledby={ariaLabelledby} aria-describedby={ariaDescribedby}>
        <View style={styles.container}>
            <Pressable
                style={styles.stopper}
                onPress={() => onMsg({ type: 'close' })}
            />
            <View
                style={[
                    styles.dynamic,
                    background && styles[`background_${background}`],
                ]}
            >
                <View style={styles.contentContainer}>{children}</View>
            </View>
        </View>
    </Modal>
)
