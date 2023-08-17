import { Rule } from 'publicodes'

import { Names } from './dist/names'

export type DottedName = Names
declare let rules: Record<Names, Rule>

export default rules