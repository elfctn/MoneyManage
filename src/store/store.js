import { legacy_createStore as createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import logger from "redux-logger";
import rootReducer from '../store/reducers/index.js'

const myStore = createStore(rootReducer, applyMiddleware(thunk, logger));

export default myStore;