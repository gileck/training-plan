import React, { useState, useEffect, createContext } from 'react';
import { localStorageAPI } from './localStorageAPI';
import { AppContext } from './AppContext';
import { useFetch } from '../useFetch';
import { getStaticImageUrl } from './exercisesList';


function useQuestionBox() {
    const [isQuestionBoxOpen, setIsQuestionBoxOpen] = useState(false)
    const [questionBoxMessage, setQuestionBoxMessage] = useState('')
    const [questionBoxCallback, setQuestionBoxCallback] = useState(null)

    return {
        isQuestionBoxOpen,
        questionBoxMessage,
        setIsQuestionBoxOpen,
        openQuestionBox: (message, cb) => {

            setQuestionBoxMessage(message)
            setIsQuestionBoxOpen(true)
            setQuestionBoxCallback({ cb })
        },
        onQuestionBoxAnswer: (answer) => {
            if (questionBoxCallback?.cb) {
                questionBoxCallback.cb(answer)
            }
            setIsQuestionBoxOpen(false)
        }
    }
}
function useAlert() {
    const [isAlertOpen, setIsAlertOpen] = React.useState(false)
    const [isErrorAlertOpen, setIsErrorAlertOpen] = React.useState(false)

    const [alertMessage, setAlertMessage] = React.useState('')
    return {
        isAlertOpen,
        setIsAlertOpen,
        alertMessage,
        setAlertMessage,
        isErrorAlertOpen,
        setIsErrorAlertOpen
    }
}






export function AppProvider({ children, setRoute, params, user }) {



    const trainingPlansFromLocal = localStorageAPI().getData('trainingPlans')
    const [trainingPlansState, setTrainingPlans] = useState(trainingPlansFromLocal || []);

    const { data: { exercises: exercisesList } } = useFetch('/api/exercises/getExercises')
    console.log({ exercisesList });
    const getImageUrl = (name) => {
        const e = exercisesList.find(e => e.name.toLowerCase() === name.toLowerCase())
        if (e && e.image) {
            return e.image
        }
        const staticImageUrl = getStaticImageUrl(name)
        if (staticImageUrl) {
            return staticImageUrl
        }
        return `/images/${name}.jpg`
    }


    useEffect(() => {
        fetch(`/api/trainingPlans/`)
            .then(res => res.json())
            .then(data => {
                setTrainingPlans(data.plans)
                localStorageAPI().saveData('trainingPlans', data.plans)
            })
            .catch((e) => {
                console.error('Error fetching data', e.message)
            })




    }, [])


    const alert = useAlert()
    const questionBox = useQuestionBox()
    const contextValue = {
        exercisesList,
        getImageUrl,
        questionBox: questionBox,
        user,
        trainingPlans: trainingPlansState,
        setTrainingPlans,
        params,
        setRoute,
        isAlertOpen: alert.isAlertOpen,
        alertMessage: alert.alertMessage,
        setIsAlertOpen: alert.setIsAlertOpen,
        openAlert: (message) => {
            alert.setAlertMessage(message)
            alert.setIsAlertOpen(true)
        },
        openErrorAlert: (message) => {
            alert.setAlertMessage(message)
            alert.setIsErrorAlertOpen(true)
        },
        isErrorAlertOpen: alert.isErrorAlertOpen,
        closeAlert: () => {
            alert.setIsAlertOpen(false)
            alert.setIsErrorAlertOpen(false)
        }
    }
    return <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
}