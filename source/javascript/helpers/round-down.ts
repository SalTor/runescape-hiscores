import _ from "lodash"

function roundDown(valueToFloor: number): number {
    return _.floor(valueToFloor)
}

export default roundDown