import React from "react";
import { TrainingPlans } from "./components/TrainingPlans";
export const DataContext = React.createContext({});
export function DataProvider({ children }) {

    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        async function getData() {
            const [{ user }, { plans }] = await Promise.all([
                fetch(`/api/user/`, {})
                    .then(res => res.json())
                    .catch((e) => {
                        console.error('Error fetching data', e.message)
                        return { user: null }
                    })

                ,
                fetch(`/api/trainingPlans/`)
                    .then(res => res.json())
                    .catch((e) => {
                        console.error('Error fetching data', e.message)
                        return { plans: [] }
                    })

            ]).catch((e) => {
                console.error('Error fetching data', e.message)
                return [{ user: null }, { plans: [] }]
            })

            setData({ user, trainingPlans: plans })
        }
        getData()
    }, [])

    if (!data) {
        return <div></div>;
    }



    return <DataContext.Provider value={{ ...data }} >
        {children}
    </DataContext.Provider >

}