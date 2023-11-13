import {
    SectionList as NativeSectionList,
    SectionListData,
    StyleSheet,
    View,
} from 'react-native'
import React, { ReactElement } from 'react'
import { SectionListRenderItem } from 'react-native/Libraries/Lists/SectionList'

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    separator: {
        height: 12,
    },
})

type Props<I, S> = {
    sections: SectionListData<I, S>[]
    emptyState: ReactElement
    footer: ReactElement | null
    renderSectionHeader: (info: {
        section: SectionListData<I, S>
    }) => ReactElement
    renderItem: SectionListRenderItem<I, S>
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_end_reached'; distanceFromEnd: number }

const ON_END_REACHED_THRESHOLD = 2 // How far from the end (in units of visible length of the list) the bottom edge of the list must be from the end of the content to trigger the onEndReached callback

export const SectionList = function <I, S>({
    sections,
    emptyState,
    renderSectionHeader,
    renderItem,
    onMsg,
    footer,
}: Props<I, S>) {
    return (
        <NativeSectionList
            style={styles.list}
            sections={sections}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            onEndReached={({ distanceFromEnd }) =>
                onMsg({ type: 'on_end_reached', distanceFromEnd })
            }
            onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
            ItemSeparatorComponent={Separator}
            SectionSeparatorComponent={Separator}
            ListEmptyComponent={emptyState}
            ListFooterComponent={footer}
        />
    )
}

const Separator = () => <View style={styles.separator} />
