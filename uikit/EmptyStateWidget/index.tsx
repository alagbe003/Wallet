import React, { ReactNode, useState } from 'react'
import { Group } from '@zeal/uikit/Group'
import { v4 as uuid } from 'uuid'
import { Row } from '@zeal/uikit/Row'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { colors } from '@zeal/uikit/colors'
import { Text } from '@zeal/uikit/Text'
import { Spacer } from '@zeal/uikit/Spacer'

const componentStyles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        alignItems: 'center',
        flexDirection: 'column',
        rowGap: 8,
    },
    sizeLarge: {
        paddingVertical: 65,
        paddingHorizontal: 16,
    },
    sizeRegular: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    clickable: {
        // @ts-ignore
        cursor: 'pointer',
    },
})

type Props = {
    icon: (renderProps: { size: number }) => ReactNode
    size: 'regular' | 'large'
    title: ReactNode
    onClick?: () => void
    action?: ReactNode
}

const ICON_SIZE = 24

export const EmptyStateWidget = ({
    icon,
    size,
    title,
    action,
    onClick,
}: Props) => {
    const [labelId] = useState(uuid())

    const wrapperStyles = [
        componentStyles.container,
        size === 'large'
            ? componentStyles.sizeLarge
            : componentStyles.sizeRegular,
        onClick ? componentStyles.clickable : null,
    ]

    return (
        <Group variant="default">
            <TouchableWithoutFeedback onPress={onClick}>
                <View
                    style={wrapperStyles}
                    role={onClick && 'button'}
                    aria-labelledby={labelId}
                >
                    {icon({ size: ICON_SIZE })}
                    <Text
                        id={labelId}
                        align="center"
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {title}
                    </Text>

                    {!action ? null : (
                        <Row spacing={0}>
                            <Spacer />
                            {action}
                            <Spacer />
                        </Row>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Group>
    )
}
