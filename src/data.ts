import { IFilterGroup, TFilterLogicCondition, TFilterCondition } from "./typings";

export const EXAMPLE_FILTER_GROUP: IFilterGroup = {
    condition: TFilterLogicCondition.and,
    groups: [
        {
            condition: TFilterLogicCondition.and,
            groups: [],
            filters: [
                {
                    field: 'AAA',
                    condition: TFilterCondition.eq,
                    value: 'aaliyah.gerhold@example.com',
                    disabled: false,
                    group: '',
                },
                {
                    field: 'BBB',
                    condition: TFilterCondition.eq,
                    value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                    disabled: false,
                    group: '',
                },
            ],
        },
        {
            condition: TFilterLogicCondition.and,
            groups: [
                {
                    condition: TFilterLogicCondition.and,
                    groups: [],
                    filters: [
                        {
                            field: 'CCC',
                            condition: TFilterCondition.eq,
                            value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'DDD',
                            condition: TFilterCondition.eq,
                            value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                            disabled: false,
                            group: '',
                        },
                    ],
                },
                {
                    condition: TFilterLogicCondition.and,
                    groups: [],
                    filters: [
                        {
                            field: 'EEE',
                            condition: TFilterCondition.eq,
                            value: 'Abominable Hoodie,Adrienne Trek Jacket',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'FFF',
                            condition: TFilterCondition.eq,
                            value: 'Aero',
                            disabled: false,
                            group: '',
                        },
                    ],
                },
                {
                    condition: TFilterLogicCondition.and,
                    groups: [],
                    filters: [
                        {
                            field: 'GGG',
                            condition: TFilterCondition.eq,
                            value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'III',
                            condition: TFilterCondition.eq,
                            value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                            disabled: false,
                            group: '',
                        },
                    ],
                },
            ],
            filters: [
                {
                    field: 'JJJ',
                    condition: TFilterCondition.eq,
                    value: 'manual',
                    disabled: false,
                    group: '',
                },
                {
                    field: 'KKK',
                    condition: TFilterCondition.eq,
                    value: 'Richmond',
                    disabled: false,
                    group: '',
                },
            ],
        },
    ],
    filters: [
        {
            field: 'LLL',
            condition: TFilterCondition.named,
            value: 'last30Days',
            group: '',
            disabled: false,
        },
        {
            field: 'MMM',
            condition: TFilterCondition.nempty,
            value: '',
            disabled: false,
            group: '',
        },
    ],
}
