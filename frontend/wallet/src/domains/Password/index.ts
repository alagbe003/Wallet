import {
    failure,
    minStringLength,
    MinStringLengthError,
    Result,
    success,
} from '@zeal/toolkit/Result'

export type Password = string

const LOW_AND_UPPER_CASE = new RegExp('(?=.*[a-z])(?=.*[A-Z])')

export type ShouldContainLowerAndUpperCase = {
    type: 'should_contain_lower_and_upper_case'
}

export const includeLowerAndUppercase = (
    password: string
): Result<ShouldContainLowerAndUpperCase, string> => {
    return LOW_AND_UPPER_CASE.test(password)
        ? success(password)
        : failure({ type: 'should_contain_lower_and_upper_case' })
}

const CONTAINS_NUMBER = new RegExp('.*\\d')
const CONTAINS_SPECIAL_CHAR = new RegExp(
    '.*[!"#$%&\'\\(\\)*+,-\\.\\/:;<=>?@\\[\\]^_`{|}~]'
)

export type ShouldContainNumberOrSpecialChar = {
    type: 'should_contain_number_or_special_char'
}

export const includesNumberOrSpecialChar = (
    password: string
): Result<ShouldContainNumberOrSpecialChar, string> => {
    return CONTAINS_NUMBER.test(password) ||
        CONTAINS_SPECIAL_CHAR.test(password)
        ? success(password)
        : failure({
              type: 'should_contain_number_or_special_char',
          })
}

export const shouldContainsMinChars = (
    password: string
): Result<MinStringLengthError, string> => minStringLength(10, password)
