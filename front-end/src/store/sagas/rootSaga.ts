import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import productSaga from './productSaga';
import cartSaga from './cartSaga';
import profileSaga from './profileSaga';

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(productSaga),
        fork(cartSaga),
        fork(profileSaga),
    ]);
}