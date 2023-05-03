export const menuTreeData = [
    {
        name: 'AnalysisTrace',
        path: '/analysis',
        icon: "histogram",
        children: [
            {
                name: 'ProjectProgress',
                path: "/analysis/project-progress",
                icon: "Tickets",
            },
        ]
    },
    {
        name: 'Expenditure',
        path: '/expenditure',
        icon: "checked",
        children: [
            {
                name: 'OwnManpower',
                path: "/expenditure/own-manpower",
                icon: "Tickets",
            },
            {
                name: 'OutsourcedManpower',
                path: "/expenditure/outsourced-manpower",
                icon: "Tickets",
            },
        ]
    },
    {
        name: 'Budget',
        path: '/budget',
        icon: "stamp",
        children: [
            {
                name: 'DeptBudget',
                path: "/budget/dept-budget",
                icon: "Tickets",
            },
            {
                name: 'ProjectBudget',
                path: "/budget/project-budget",
                icon: "Tickets",
            },
        ]
    },
    {
        name: 'Basic',
        path: '/basic',
        icon: "grid",
        children: [
            {
                name: 'BussinessList',
                path: "/basic/bussiness-list",
                icon: "Tickets",
            },
            {
                name: 'ProjectList',
                path: "/basic/project-list",
                icon: "Tickets",
            },
            {
                name: 'DataWork',
                path: "/basic/data-work",
                icon: "Tools",
            },
        ]
    },
];

export const budgetYearOptions = ['2022', '2023', '2024'];
export const possibleOccurrenceOptions = [{ name: "可能发生", value: "1" }, { name: "必然发生", value: "0" }];