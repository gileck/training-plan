import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from 'fs'
import path from 'path'

let OPENAI_API_KEY = null
if (process.env.NODE_ENV === 'development') {
    const { parsed } = dotenv.config()
    OPENAI_API_KEY = parsed.OPENAI_API_KEY
} else {
    OPENAI_API_KEY = process.env.OPENAI_API_KEY
}

// const { parsed: { OPENAI_API_KEY } } = dotenv.config()
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MILLION = 1000000
const modelPrices = {
    'gpt-3.5-turbo': {
        prompt_tokens_price: 0.5 / MILLION,
        completion_tokens_price: 1.5 / MILLION
    },
    'gpt-4-turbo': {
        prompt_tokens_price: 10 / MILLION,
        completion_tokens_price: 30 / MILLION
    },
    'gpt-4o': {
        prompt_tokens_price: 5 / MILLION,
        completion_tokens_price: 15 / MILLION
    },
}

function calcPrice(model, tokens) {
    const { completion_tokens, prompt_tokens } = tokens
    const prompt_tokens_price = modelPrices[model].prompt_tokens_price
    const completion_tokens_price = modelPrices[model].completion_tokens_price
    const price = ((prompt_tokens) * prompt_tokens_price) + ((completion_tokens) * completion_tokens_price)
    return Math.round((price * 3.7) * 1000) / 1000;
}

const models = {
    '3': 'gpt-3.5-turbo',
    '4': 'gpt-4o'
}
export async function getResult({ messages, systemText, inputText, max_tokens, isJSON, temperature, model }) {
    const modelToUse = models[model] || 'gpt-4-1106-preview'
    const gptOptions = {
        model: modelToUse,
        temperature: temperature || 0.8,
        response_format: { "type": isJSON ? "json_object" : 'text' },
        max_tokens: max_tokens || 1000,
        messages: messages || [
            {
                "role": "system",
                "content": `${systemText}`

            },
            {
                "role": "user",
                "content": `${inputText}`
            }
        ],

    }
    const response = await openai.chat.completions.create(gptOptions).catch(e => {
        console.log(`ERROR in getResponseFromGpt: ${e.message}`)
        return null
    })
    if (!response) {
        return null
    }
    // console.log({response})
    const content = response.choices[0].message.content
    const usage = response.usage
    const apiPrice = calcPrice(modelToUse, usage)

    fs.appendFileSync(path.resolve('gptFiles', `${(new Date()).toLocaleTimeString()}.json`), `
    ${JSON.stringify({ content, usage, apiPrice }, null, 2) + '\n\n'}
    `)

    return {
        result: isJSON ? JSON.parse(content) : content,
        apiPrice
    }
}

export async function getResponseFromGpt({ system, inputText, isJSON, model }) {
    const modelToUse = models[model || '4']

    const data = {
        model: modelToUse,
        temperature: 0.8,
        response_format: { "type": isJSON ? "json_object" : 'text' },
        messages: [
            {
                "role": "system",
                "content": `${system}`

            },
            {
                "role": "user",
                "content": `${inputText}`
            }
        ],
        max_tokens: 1000,
    }


    const response = await openai.chat.completions.create(data).catch(e => {
        console.log(`ERROR in getResponseFromGpt: ${e.message}`)
        return {
            message: e.message,

        }
    })
    if (!response.choices) {
        return {
            result: null,
            apiPrice: 0,
            modelToUse,
            error: true,
            message: response.message
        }
    }
    console.log({ response })



    const content = response.choices[0].message.content
    const usage = response.usage
    const apiPrice = calcPrice(modelToUse, usage)

    // fs.appendFileSync(path.resolve('gptFiles', `${(new Date()).toLocaleTimeString()}.json`), `
    // ${JSON.stringify({ content, usage, apiPrice }, null, 2) + '\n\n'}
    // `)

    return {
        result: isJSON ? JSON.parse(content) : content,
        apiPrice,
        modelToUse
    }


}