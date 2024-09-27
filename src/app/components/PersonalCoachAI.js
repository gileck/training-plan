import React, { useEffect } from 'react';
import { Chat } from "@/app/components/chat";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Grid, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Typography, IconButton, LinearProgress } from "@mui/material";
import Divider from "@mui/material/Divider";
import { ArrowBack, ArrowForward, ArrowLeft, ArrowRight, Cancel, Check, Info, Login } from "@mui/icons-material";
import { AppContext } from "../AppContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useFetch } from '@/useFetch';
import { Line } from 'recharts';

export const questionsData = [
    {
        key: "sleep",
        question: "How did you sleep last night?",

    },
    {
        key: "energy",
        question: "How is your energy level today?",

    },
    {
        key: "mood",
        question: "How is your mood today?",

    },
    {
        key: "stress",
        question: "How is your stress level today?",
    },
];

const colors = {
    1: 'red',
    2: 'orange',
    3: 'gray',
    4: 'blue',
    5: 'darkgreen',
};

const answers = {
    1: SentimentVeryDissatisfiedIcon,
    2: SentimentDissatisfiedIcon,
    3: SentimentSatisfiedIcon,
    4: SentimentSatisfiedAltIcon,
    5: SentimentVerySatisfiedIcon
};


function QuestionBox({
    currentQuestion,
    handleAnswer,
}) {
    return <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            {currentQuestion.question}
        </Typography>
        <Grid container spacing={2} justifyContent="center">
            {Object.entries(answers).map(([
                value,
                Icon,
            ]) => (
                <Grid item xs={2} key={value} style={{ display: 'inline-block' }}>
                    <Box
                        sx={{
                            border: currentQuestion.answer === value ? '1px solid #ccc' : '',
                            borderRadius: 5,
                            backgroundColor: currentQuestion.answer === value ? colors[currentQuestion.answer] : 'white',
                        }}
                    >
                        <IconButton
                            variant={'outlined'}
                            sx={{ fontSize: 10, }}
                            onClick={() => handleAnswer(currentQuestion.key, value)}
                        >
                            <Icon sx={{
                                color: currentQuestion.answer === value ? 'white' : colors[Number(value)]
                            }} fontSize="large" />
                        </IconButton>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
}

function getDate() {
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    // const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    return date;
}

export const PersonalCoachAI = () => {
    const [questions, setQuestions] = useState(questionsData);
    const { openAlert } = useContext(AppContext);
    const [answerLoading, setAnswerLoading] = useState({});
    const [currentDate, setCurrentDate] = useState(getDate());
    const { data: answers, loading } = useFetch('/api/dailyHealthMetrics/getMetrics', {
        method: 'GET',
        query: {
            date: currentDate
        },
        shouldUsecache: false
    });
    useEffect(() => {
        setQuestions((prevQuestions) => {
            return prevQuestions.map((q) => {
                return {
                    ...q,
                    answer: null,
                };
            });
        })
    }, [currentDate]);

    useEffect(() => {
        console.log({ answers });
        if (answers?.results?.length > 0) {
            setQuestions((prevQuestions) => {
                return prevQuestions.map((q) => {
                    const answer = answers.results.find((a) => a.key === q.key);
                    if (answer) {
                        return {
                            ...q,
                            answer: answer.answer,
                        };
                    }
                    return q;
                });
            });
        }
    }, [answers])



    // console.log({ questions });

    const handleAnswer = async (questionKey, answerValue) => {
        setAnswerLoading({ [questionKey]: true });
        // console.log({
        //     questionId,
        //     answerValue,
        // });
        setQuestions((prevQuestions) => {
            return prevQuestions.map((q) => {
                if (q.key === questionKey) {
                    return {
                        ...q,
                        answer: answerValue,
                    };
                }
                return q;
            });
        })
        // Simulate sending the data to an API
        const result = await fetch('/api/dailyHealthMetrics/updateMetric', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: questionKey,
                answer: answerValue,
                date: getDate()
            }),
        })
            .then((res) => res.json())
            .catch((e) => {
                console.error('Error fetching data', e.message);
            })
            .finally(() => {
                setAnswerLoading({ [questionKey]: false });
            });
        if (result && !result.error) {
            openAlert(`Answer ${result.updated ? 'updated' : 'saved'} successfully`);
        }


    };

    function changeCurrentDate(days) {
        const dateArray = currentDate.split('/');
        const currentDateObject = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
        currentDateObject.setDate(currentDateObject.getDate() + days);
        const date = currentDateObject.getDate() + '/' + (currentDateObject.getMonth() + 1) + '/' + currentDateObject.getFullYear();
        setCurrentDate(date);
    }


    return (
        <>
            {
                loading ? <LinearProgress color="secondary" /> : ''
            }

            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 0, textAlign: 'center' }}>
                        <IconButton
                            onClick={() => changeCurrentDate(-1)}
                        >
                            <ArrowLeft />
                        </IconButton>
                        {currentDate}
                        <IconButton
                            onClick={() => changeCurrentDate(+1)}
                        >
                            <ArrowRight />
                        </IconButton>
                    </Typography>
                    <Button
                        onClick={() => setCurrentDate(getDate())}
                    >Today</Button>
                </Box>

                <Divider />


                {
                    questions.map((question, index) => (
                        <>
                            <QuestionBox
                                key={`${question.key}-{${question.answer}`}
                                currentQuestion={question}
                                handleAnswer={handleAnswer}
                            />
                            {
                                answerLoading[question.key] ? <LinearProgress color="secondary" /> : ''
                            }
                            <Divider />
                        </>
                    ))
                }
                {/* {
                questions.every((q) => q.answer) ?
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                        <CheckCircleIcon fontSize="large" color="success" />
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Thank you for completing the quiz!
                        </Typography>
                    </Box>
                    : ''
            } */}
            </Box >
        </>
    );
};

