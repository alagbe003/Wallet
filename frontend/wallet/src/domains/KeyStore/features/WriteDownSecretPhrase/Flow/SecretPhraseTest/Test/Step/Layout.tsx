import { Layout2 } from 'src/uikit/Layout/Layout2'
import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button, IconButton } from 'src/uikit'
import { BackIcon } from 'src/uikit/Icon/Navigation/BackIcon'
import { Column2 } from 'src/uikit/Column2'
import { Header } from 'src/uikit/Header'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import { Text2 } from 'src/uikit/Text2'
import { ProgressShield } from 'src/uikit/Icon/ProgressShield'
import { Row } from '@zeal/uikit/Row'
import { randomize } from '@zeal/toolkit/Array/helpers/randomaize'
import { values } from '@zeal/toolkit/Object'

export type SecretPhraseTestStep = {
    currentWordsIndexes: [number, number, number, number]
    correctIndex: number
    remainingWordsIndexes: number[]
}

export const generateSecretPhraseTestSteps = (
    steps: SecretPhraseTestStep[],
    remainingIndexes: number[],
    secretPhraseArray: string[],
    stepsCount: number
): SecretPhraseTestStep[] => {
    const randomIndexes = randomize(remainingIndexes)

    const [correctIndex, ...remainingWordsIndexes] = randomIndexes

    const headWord = secretPhraseArray[correctIndex]

    const uniqWordsRemainingIndexes = values(
        remainingWordsIndexes
            .map(
                (index) => [index, secretPhraseArray[index]] as [number, string]
            )
            .reduce(
                (acc, [index, word]) => ({ ...acc, [word]: index }),
                {} as Record<string, number>
            )
    )

    const filteredRestIndexes = uniqWordsRemainingIndexes.filter((index) => {
        const word = secretPhraseArray[index]
        return word !== headWord
    })

    const currentWordsIndexes = randomize([
        ...filteredRestIndexes.slice(0, 3),
        correctIndex,
    ]) as [number, number, number, number]

    const newStep: SecretPhraseTestStep = {
        currentWordsIndexes,
        remainingWordsIndexes,
        correctIndex,
    }

    const newSteps: SecretPhraseTestStep[] = [...steps, newStep]

    if (newSteps.length < stepsCount) {
        return generateSecretPhraseTestSteps(
            newSteps,
            remainingWordsIndexes,
            secretPhraseArray,
            stepsCount
        )
    } else {
        return newSteps
    }
}

type Props = {
    secretPhraseArray: string[]
    step: SecretPhraseTestStep
    totalSteps: number
    remainingSteps: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_correct_answer_click' }
    | { type: 'on_wrong_answer_click' }
    | { type: 'on_step_back_button_click' }

export const Layout = ({
    onMsg,
    secretPhraseArray,
    remainingSteps,
    step,
    totalSteps,
}: Props) => {
    const completed = new Array(totalSteps - remainingSteps - 1)
        .fill(true)
        .map((_, index) => (
            <div key={`completed-${index}`}>
                <ProgressShield size={24} color="iconAccent2" />
            </div>
        ))

    const remaining = new Array(remainingSteps + 1)
        .fill(true)
        .map((_, index) => (
            <div key={`remaining-${index}`}>
                <ProgressShield size={24} color="iconDefault" />
            </div>
        ))

    return (
        <Layout2 padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        onClick={() =>
                            onMsg({ type: 'on_step_back_button_click' })
                        }
                    >
                        <BackIcon size={24} />
                    </IconButton>
                }
            />
            <Column2 spacing={24}>
                <Row spacing={8} alignX="center">
                    {completed}
                    {remaining}
                </Row>
                <Header
                    title={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.secret_phrase_test.title"
                            defaultMessage="What is word {count} in your Secret Phrase?"
                            values={{
                                count: (
                                    <Text2 color="textAccent2">
                                        #{step.correctIndex + 1}
                                    </Text2>
                                ),
                            }}
                        />
                    }
                />
                <Column2 spacing={8}>
                    {step.currentWordsIndexes.map((value) => {
                        return (
                            <Button
                                key={secretPhraseArray[value]}
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                    onMsg(
                                        value === step.correctIndex
                                            ? {
                                                  type: 'on_correct_answer_click',
                                              }
                                            : { type: 'on_wrong_answer_click' }
                                    )
                                }}
                            >
                                {secretPhraseArray[value]}
                            </Button>
                        )
                    })}
                </Column2>
            </Column2>
        </Layout2>
    )
}
