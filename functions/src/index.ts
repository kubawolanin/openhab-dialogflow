'use strict';

process.env.DEBUG = 'actions-on-google:*';

import * as functions from 'firebase-functions';
const { DialogflowApp } = require('actions-on-google');
import { sprintf } from 'sprintf-js';

const DEFAULT_LOCALE = 'en-US';
const config = require('./config.js');
const localizedStrings = {
    'en-US': require('./strings_en-US.js')
};

const DEBUG_LOGS = true;

// const IMAGE_URL = config.imageUrl; // TODO: Code

/** Dialogflow Actions {@link https://dialogflow.com/docs/actions-and-parameters#actions} */
const Actions = {
    GET_ITEM_STATE: 'get.item.state',
    UNRECOGNIZED_DEEP_LINK: 'deeplink.unknown'
};
/** Dialogflow Contexts {@link https://dialogflow.com/docs/contexts} */
const Contexts = {
    GET_ITEM_STATE: 'get.item.state'
};
/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */
const Lifespans = {
    DEFAULT: 5,
    END: 0
};
/** Dialogflow Parameters {@link https://dialogflow.com/docs/actions-and-parameters#parameters} */
const Parameters = {
    ITEM: 'item',
    ROOM: 'room'
};

const ask = (app, inputPrompt, noInputPrompts?) => {
    app.data.lastPrompt = inputPrompt;
    app.data.lastNoInputPrompts = noInputPrompts;
    app.ask(inputPrompt, noInputPrompts);
};

/**
 * @template T
 * @param {Array<T>} array The array to get a random value from
 */
const getRandomValue = array => array[Math.floor(Math.random() * array.length)];

/**
 * Case insensitive string replacing
 * @param text Text to replace
 * @param mapObject Map object
 */
const replaceAll = (text: string, mapObject: any) => {
    const pattern = new RegExp(Object.keys(mapObject).join("|"), "g");

    return text.replace(pattern, function (matched) {
        return mapObject[matched];
    });
};

const list = (array, strings) => {
    let items = array.toString();

    if (array.length > 1) {
        items = array
            .map((item, index, arr) => {
                if (index === arr.length - 1) {
                    return `${strings.general.or} ${item}`;
                }
                if (index === arr.length - 2) {
                    return item;
                }
                return `${item},`;
            })
            .join(' ');
    }

    return items;
}

/**
 * Greet the user and direct them to next turn
 * @param {DialogflowApp} app DialogflowApp instance
 * @return {void}
 */
const unhandledDeepLinks = app => {
    const strings = localizedStrings[app.getUserLocale()] || localizedStrings[DEFAULT_LOCALE];
    const rawInput = app.getRawInput();
    const response = sprintf(strings.general.unhandled, rawInput);
    const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
    if (!screenOutput) {
        ask(app, response, strings.general.noInputs);
    }
    const suggestions = strings.categories.map(category => category.suggestion);
    const richResponse = app
        .buildRichResponse()
        .addSimpleResponse(response)
        .addSuggestions(suggestions);

    ask(app, richResponse, strings.general.noInputs);
};

/**
 * Set up app.data for use in the action
 * @param {DialogflowApp} app DialogflowApp instance
 */
const initData = app => {
    const data = app.data;
    return data;
};

const plainText = (ssmlText: string) => ssmlText.replace(/<[^>]*>/g, '').trim();

const simpleResponse = (ssmlText: string) => { return { speech: ssmlText, displayText: plainText(ssmlText) } };
/**
 * Return a state of a given item
 * @param app 
 */
const getItemState = app => {
    const strings = localizedStrings[app.getUserLocale()] || localizedStrings[DEFAULT_LOCALE];
    const data = initData(app);

    const item = app.getArgument(Parameters.ITEM);
    const room = app.getArgument(Parameters.ROOM);

    if (DEBUG_LOGS) {
        console.log('Received data', data);
        console.log('Received parameters', item, room);
    }

    if (item) {
        const state = '25%'; // TODO: Get the state
        const verbalResponse = sprintf(
            getRandomValue(strings.item.get),
            {
                item: item,
                state: state
            }
        );

        // const card = app.buildBasicCard()
        // .setImage('http://some-image-url', `Image Item Label`)

        app.tell(
            app.buildRichResponse()
                .addSimpleResponse(simpleResponse(verbalResponse))
            // .addBasicCard(card)
        );
    } else {
        ask(app, getRandomValue(strings.item.notfound.get))
    }
};

const actionMap = new Map();
actionMap.set(Actions.UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
actionMap.set(Actions.GET_ITEM_STATE, getItemState);

/**
 * The entry point to handle a http request
 * @param {Request} request An Express like Request object of the HTTP request
 * @param {Response} response An Express like Response object to send back data
 */
const openHab = functions.https.onRequest((request, response) => {
    const app = new DialogflowApp({
        request,
        response
    });
    console.log(`Request headers: ${JSON.stringify(request.headers)}`);
    console.log(`Request body: ${JSON.stringify(request.body)}`);
    app.handleRequest(actionMap);
});

const imageItem = functions.https.onRequest((request, response) => {
    // TODO
});

module.exports = {
    openHab,
    imageItem
};
