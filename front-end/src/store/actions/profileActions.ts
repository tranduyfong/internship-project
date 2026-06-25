import { createAction } from '@reduxjs/toolkit';

export const fetchProfileRequest = createAction('user/fetchProfile');
export const updateProfileRequest = createAction<{ name: string; phone: string }>('user/updateProfile');
export const addAddressRequest = createAction<any>('user/addAddress');
export const updateAddressRequest = createAction<{ id: number; data: any }>('user/updateAddress');
export const deleteAddressRequest = createAction<number>('user/deleteAddress');
export const setDefaultAddressRequest = createAction<number>('user/setDefaultAddress');