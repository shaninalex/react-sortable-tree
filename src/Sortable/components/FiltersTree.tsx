import _ from 'lodash'
import { useRef } from 'react'
import { IFilterGroupSort, IFilterSort } from '../types'
import { Wrapper } from './Wrapper'

interface GroupTreeProps {
    groups: IFilterGroupSort[]
    onChange: (groups: IFilterGroupSort[]) => void
}

const GROUP_CHANGE_PAYLOAD = ['currentList', 'groupsIndex']
// const FILTER_CHANGE_PAYLOAD = ['currentFiltersList', 'filtersIndex']

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
        const attemps = [...ref.current]
        if (!attemps.length) return

        // change groups only if all attemts contain groupIndex and currentList properties
        if (areKeysMatching(attemps, GROUP_CHANGE_PAYLOAD)) {
            attemps.sort((a, b) => b.groupsIndex.length - a.groupsIndex.length)
            const tempList = [...groups]
            let attempIndex = 0
            while (attempIndex < attemps.length) {
                const attemp = { ...attemps[attempIndex] }
                attempIndex++
                const _blockIndex = [...attemp.groupsIndex]
                const lastIndex = _blockIndex.pop()!
                const lastArr = _blockIndex.reduce((arr, i) => arr[i]['groups'] ?? [], tempList)
                lastArr[lastIndex]['groups'] = attemp.currentList
            }
            ref.current = []
            onChange(tempList)
        } else {
            console.log(attemps)
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
