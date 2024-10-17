import { IFilterGroup, TFilterLogicCondition, TFilterCondition } from "./typings";

export const EXAMPLE_FILTER_GROUP: IFilterGroup = {
    condition: TFilterLogicCondition.and,
    groups: [
        {
            condition: TFilterLogicCondition.and,
            groups: [],
            filters: [
                {
                    field: 'customers.email',
                    condition: TFilterCondition.eq,
                    value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                    disabled: false,
                    group: '',
                },
                {
                    field: 'customers.name',
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
                // {
                //     field: 'customers.email',
                //     condition: TFilterCondition.eq,
                //     value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                //     disabled: false,
                //     group: '',
                // },
                // {
                //     field: 'customers.name',
                //     condition: TFilterCondition.eq,
                //     value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                //     disabled: false,
                //     group: '',
                // },
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
                            field: 'customers.email',
                            condition: TFilterCondition.eq,
                            value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'customers.name',
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
                        // {
                        //     condition: TFilterLogicCondition.and,
                        //     groups: [],
                        //     filters: [
                        //         {
                        //             field: 'customers.email',
                        //             condition: TFilterCondition.eq,
                        //             value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //         {
                        //             field: 'customers.name',
                        //             condition: TFilterCondition.eq,
                        //             value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //         {
                        //             field: 'customers.email',
                        //             condition: TFilterCondition.eq,
                        //             value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //         {
                        //             field: 'customers.name',
                        //             condition: TFilterCondition.eq,
                        //             value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //     ],
                        // },
                        // {
                        //     condition: TFilterLogicCondition.and,
                        //     groups: [],
                        //     filters: [
                        //         {
                        //             field: 'customers.email',
                        //             condition: TFilterCondition.eq,
                        //             value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //         {
                        //             field: 'customers.name',
                        //             condition: TFilterCondition.eq,
                        //             value: 'Aaliyah Keeling,Aaliyah Haag,Aaliyah Crist',
                        //             disabled: false,
                        //             group: '',
                        //         },
                        //     ],
                        // },
                    ],
                    filters: [
                        {
                            field: 'products.name',
                            condition: TFilterCondition.eq,
                            value: 'Abominable Hoodie,Adrienne Trek Jacket',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'products.vendor',
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
                            field: 'customers.email',
                            condition: TFilterCondition.eq,
                            value: 'aaliyah.gerhold@example.com,aaliyah.haag@example.com,aaliyah.keeling@example.com',
                            disabled: false,
                            group: '',
                        },
                        {
                            field: 'customers.name',
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
                    field: 'sales.gateway',
                    condition: TFilterCondition.eq,
                    value: 'manual',
                    disabled: false,
                    group: '',
                },
                {
                    field: 'locations.city',
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
            field: 'transactions.processed_at',
            condition: TFilterCondition.named,
            value: 'last30Days',
            group: '',
            disabled: false,
        },
        {
            field: 'customers.phone',
            condition: TFilterCondition.nempty,
            value: '',
            disabled: false,
            group: '',
        },
    ],
}
