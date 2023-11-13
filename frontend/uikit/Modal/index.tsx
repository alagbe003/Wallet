import React from 'react'
import { Modal as NativeModal, StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

type Props = {
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-describedby'?: string
}

export const Modal = ({
    children,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
}: Props) => (
    <NativeModal
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        animationType="none"
        transparent
        visible
    >
        <View style={styles.overlay}>{children}</View>
    </NativeModal>
)
