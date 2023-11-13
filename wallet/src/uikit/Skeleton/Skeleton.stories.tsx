import { Column2 } from 'src/uikit/Column2'

import { Skeleton } from './Skeleton'

export default {
    component: Skeleton,
}

export const Default = () => {
    return (
        <Column2 spacing={24}>
            <div style={{ background: '#246B74' }}>
                <Column2 spacing={8}>
                    <Skeleton variant="default" height={8} width="1000%" />
                    <Skeleton variant="default" height={50} width="50%" />
                </Column2>
            </div>

            <div style={{ background: '#fff' }}>
                <Column2 spacing={8}>
                    <Skeleton variant="default" height={8} width="1000%" />
                    <Skeleton variant="default" height={50} width="50%" />
                </Column2>
            </div>
        </Column2>
    )
}
