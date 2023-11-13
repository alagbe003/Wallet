import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Country, CountryISOCode } from '@zeal/domains/Country'
import { IconButton } from 'src/uikit'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column2 } from 'src/uikit/Column2'
import { EmptyStateWidget } from 'src/uikit/EmptyStateWidget'
import { Group } from 'src/uikit/Group'
import { Header } from 'src/uikit/Header'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { OutlineSearch } from 'src/uikit/Icon/OutlineSearch'
import { QuestionCircle } from 'src/uikit/Icon/QuestionCircle'
import { Input2 } from 'src/uikit/Input/Input2'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Item } from './Item'

const PRIORITY_COUNTRIES = new Set<CountryISOCode>([
    'GB',
    'US',
    'DE',
    'JP',
    'NG',
]) // TODO: Does it make sense for this to be on a domain level?

type Props = {
    selectedCountry: CountryISOCode | null
    countries: Country[]
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_country_selected'; countryCode: CountryISOCode }

export const CountrySelector = ({
    selectedCountry,
    countries,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const priorityCountriesList = countries
        .filter((country) => PRIORITY_COUNTRIES.has(country.code))
        .filter((country) => {
            return (
                !search ||
                country.name.toLowerCase().includes(search.toLowerCase())
            )
        })

    const countryList = countries.filter((country) => {
        const passesSearch =
            !search || country.name.toLowerCase().includes(search.toLowerCase())

        return passesSearch && !PRIORITY_COUNTRIES.has(country.code)
    })

    return (
        <Layout2 background="light" padding="form">
            <ActionBar
                right={
                    <IconButton onClick={() => onMsg({ type: 'close' })}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column2 spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="countrySelector.title"
                            defaultMessage="Choose country"
                        />
                    }
                />
                <Column2 spacing={12}>
                    <Input2
                        autoFocus
                        placeholder={formatMessage({
                            id: 'countrySelector.searchPlaceholder',
                            defaultMessage: 'Search',
                        })}
                        leftIcon={
                            <OutlineSearch size={24} color="iconDefault" />
                        }
                        state="normal"
                        variant="regular"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />

                    {priorityCountriesList.length === 0 &&
                        countryList.length === 0 && (
                            <EmptyStateWidget
                                size="regular"
                                title={
                                    <FormattedMessage
                                        id="countrySelector.noCountryFound"
                                        defaultMessage="No country found"
                                    />
                                }
                                icon={({ size }) => (
                                    <QuestionCircle
                                        size={size}
                                        color="iconDefault"
                                    />
                                )}
                            />
                        )}

                    <Column2 spacing={12} style={{ overflowY: 'auto' }}>
                        {priorityCountriesList.length > 0 && (
                            <Group
                                variant="default"
                                style={{ flex: '1 0 auto' }}
                            >
                                {priorityCountriesList.map(
                                    (country: Country) => (
                                        <Item
                                            key={country.code}
                                            selected={
                                                selectedCountry === country.code
                                            }
                                            country={country.code}
                                            onClick={() =>
                                                onMsg({
                                                    type: 'on_country_selected',
                                                    countryCode: country.code,
                                                })
                                            }
                                        />
                                    )
                                )}
                            </Group>
                        )}

                        {countryList.length > 0 && (
                            <Group
                                variant="default"
                                style={{ flex: '1 0 auto' }}
                            >
                                {countryList.map((country: Country) => (
                                    <Item
                                        key={country.code}
                                        selected={
                                            selectedCountry === country.code
                                        }
                                        country={country.code}
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_country_selected',
                                                countryCode: country.code,
                                            })
                                        }
                                    />
                                ))}
                            </Group>
                        )}
                    </Column2>
                </Column2>
            </Column2>
        </Layout2>
    )
}
