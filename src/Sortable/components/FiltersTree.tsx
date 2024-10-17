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
        const objectKeys = Object.keys(obj);
        return _.isEqual(_.sortBy(objectKeys), _.sortBy(match));
    });
}


export const FiltersTree = (props: GroupTreeProps) => {
    const { groups, onChange } = props
    const ref = useRef<any[]>([])// eslint-disable-line

    const handleSetGroups = (groupsIndex: number[], currentList: IFilterGroupSort[]) => {
        ref.current.push({ groupsIndex, currentList })
    }

    const handleOnEnd = () => {
        const attempts = [...ref.current]
        if (!attempts.length) return

        if (areKeysMatching(attempts, GROUP_CHANGE_PAYLOAD)) {
            // Handling group reordering
            attempts.sort((a, b) => b.groupsIndex.length - a.groupsIndex.length)
            const tempList = [...groups]
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

        } else if (areKeysMatching(attempts, FILTER_CHANGE_PAYLOAD)) {
            // Handling filter reordering
            attempts.sort((a, b) => b.filtersIndex.length - a.filtersIndex.length)
            const tempList = [...groups]
            let attemptIndex = 0
            while (attemptIndex < attempts.length) {
                const attempt = { ...attempts[attemptIndex] }
                attemptIndex++
                const _filterIndex = [...attempt.filtersIndex]
                const lastIndex = _filterIndex.pop()!
                const lastArr = _filterIndex.reduce((arr, i) => arr[i]?.filters ?? [], tempList)
                if (!lastArr[lastIndex]) continue // Avoid undefined issues
                lastArr[lastIndex].filters = attempt.currentFiltersList
            }
            onChange(tempList)
        } else {
            console.log('Invalid payload:', attempts)
        }

        // always clear "current"
        ref.current = []
    }

    const handleSetListFilters = (filtersIndex: number[], currentFiltersList: IFilterSort[]) => {
        ref.current.push({ filtersIndex, currentFiltersList })
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
