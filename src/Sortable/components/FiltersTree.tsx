import _ from 'lodash'
import { useRef } from 'react'
import { IFilterGroupSort, IFilterSort } from '../types'
import { Wrapper } from './Wrapper'

interface GroupTreeProps {
    groups: IFilterGroupSort[]
    onChange: (groups: IFilterGroupSort[]) => void
}

const GROUP_CHANGE_PAYLOAD = ['currentList', 'groupsIndex']
const FILTER_CHANGE_PAYLOAD = ['currentFiltersList', 'filtersIndex']

// areKeysMatching - check what we change. It should prevent from crashing when
// filter "want" to inset it self into group list or group into filters list.
function areKeysMatching(objects: Array<Record<string, any>>, match: string[]): boolean {// eslint-disable-line
    return objects.every(obj => {
        const objectKeys = Object.keys(obj)
        return _.isEqual(_.sortBy(objectKeys), _.sortBy(match))
    })
}

export const FiltersTree = (props: GroupTreeProps) => {
    const { groups, onChange } = props
    const ref = useRef<any[]>([])// eslint-disable-line

    const handleOnEnd = () => {
        const attempts = [...ref.current]
        if (!attempts.length) return
        const tempList = [...groups]

        if (areKeysMatching(attempts, GROUP_CHANGE_PAYLOAD)) {
            reorderGroups(attempts, tempList)
        } else if (areKeysMatching(attempts, FILTER_CHANGE_PAYLOAD)) {
            reorderFilters(attempts, tempList)
        } else {
            console.error('Invalid payload:', attempts, 'Unable to add filters to groups or vice versa')
        }

        // always clear "current"
        ref.current = []
    }

    const handleSetGroups = (groupsIndex: number[], currentList: IFilterGroupSort[]) => {
        ref.current.push({ groupsIndex, currentList })
    }

    // Handling group reordering
    const reorderGroups = (attempts: any[], tempList: IFilterGroupSort[]) => {// eslint-disable-line
        attempts.sort((a, b) => b.groupsIndex.length - a.groupsIndex.length)
        let attemptIndex = 0
        while (attemptIndex < attempts.length) {
            const attempt = { ...attempts[attemptIndex] }
            attemptIndex++
            const _blockIndex = [...attempt.groupsIndex]
            const lastIndex = _blockIndex.pop()!
            const lastArr = _blockIndex.reduce((arr, i) => arr[i]['groups'] ?? [], tempList)
            lastArr[lastIndex]['groups'] = attempt.currentList
        }
        onChange(tempList)
    }

    const handleSetListFilters = (filtersIndex: number[], currentFiltersList: IFilterSort[]) => {
        ref.current.push({ filtersIndex, currentFiltersList })
    }

    // Handling filters reordering
    const reorderFilters = (attempts: any[], tempList: IFilterGroupSort[]) => {// eslint-disable-line
        attempts.sort((a, b) => b.filtersIndex.length - a.filtersIndex.length)
        attempts.forEach(attempt => {
            const _filterIndex = [...attempt.filtersIndex]
            const lastIndex = _filterIndex.pop()!
            const targetFilterGroup = _filterIndex.reduce((arr, i) => arr[i]?.groups ?? [], tempList)
            if (!targetFilterGroup[lastIndex]) return
            targetFilterGroup[lastIndex].filters = attempt.currentFiltersList
        })
        onChange(tempList)
    }

    return (
        <div>
            <Wrapper
                key={groups[0].id}
                group={groups[0]}
                groupsIndex={[0]}
                setList={handleSetGroups}
                setListFilters={handleSetListFilters}
                onEnd={handleOnEnd}
                isRoot
            />
        </div>
    )
}
