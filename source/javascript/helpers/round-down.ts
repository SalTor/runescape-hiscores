import { floor } from 'lodash-es'

function roundDown(valueToFloor: number): number {
    return floor(valueToFloor)
}

export default roundDown