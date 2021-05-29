// <copyright file="api-list.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from './axios-jwt-decorator';
import { getBaseUrl } from '../configVariables';
import { AxiosResponse } from "axios";
import { IADDistributionList } from "./../components/add-distribution-list/add-distribution-list"
import { IDistributionListMember, IUserPageSizeChoice, IPresenceData } from "./../components/distribution-list-members/distribution-list-members"
import { IDistributionList } from "./../components/distribution-lists/distribution-lists"

let baseAxiosUrl = getBaseUrl() + '/api';

export const getFavoriteDistributionLists = async (): Promise<AxiosResponse<IDistributionList[]>> => {
    let url = baseAxiosUrl + "/distributionlists";
    return await axios.get(url);
}

export const getADDistributionLists = async (query: string): Promise<AxiosResponse<IADDistributionList[]>> => {
    let url = baseAxiosUrl + "/distributionlists/getDistributionList?query=" + encodeURIComponent(query);
    return await axios.get(url);
}

export const createFavoriteDistributionList = async (payload: {}): Promise<AxiosResponse<void>> => {
    let url = baseAxiosUrl + "/distributionlists";
    return await axios.post(url, payload);
}

export const updateFavoriteDistributionList = async (payload: {}): Promise<AxiosResponse<void>> => {
    let url = baseAxiosUrl + "/distributionlists";
    return await axios.put(url, payload);
}

export const deleteFavoriteDistributionList = async (payload: {}): Promise<AxiosResponse<void>> => {
    let url = baseAxiosUrl + "/distributionlists";
    return await axios.delete(url, payload);
}

export const getDistributionListsMembers = async (groupId?: string): Promise<AxiosResponse<IDistributionListMember[]>> => {
    let url = baseAxiosUrl + "/distributionlistmembers?groupId=" + groupId;
    return await axios.get(url);
}

export const pinStatusUpdate = async (pinnedUser: string, status: boolean, distributionListId: string): Promise<AxiosResponse<void>> => {
    var payload = {
        "pinnedUserId": pinnedUser,
        "distributionListId": distributionListId
    }
    if (status) {
        let url = baseAxiosUrl + "/distributionlistmembers";
        return await axios.post(url, payload);
    }
    else {
        let url = baseAxiosUrl + "/distributionlistmembers";
        return await axios.delete(url, payload);
    }
}

export const getDistributionListMembersOnlineCount = async (groupId?: string): Promise<AxiosResponse<string>> => {
    let url = baseAxiosUrl + "/presence/GetDistributionListMembersOnlineCount?groupId=" + groupId;
    return await axios.get(url);
}

export const getUserPresence = async (payload: {}): Promise<AxiosResponse<IPresenceData[]>> => {
    let url = baseAxiosUrl + "/presence/getUserPresence";
    return await axios.post(url, payload);
}

export const getUserPageSizeChoice = async (): Promise<AxiosResponse<IUserPageSizeChoice>> => {
    let url = baseAxiosUrl + "/UserPageSize";
    return await axios.get(url);
}

export const createUserPageSizeChoice = async (payload: {}): Promise<AxiosResponse<void>> => {
    let url = baseAxiosUrl + "/UserPageSize";
    return await axios.post(url, payload);
}

export const getAuthenticationMetadata = async (windowLocationOriginDomain: string, loginHint: string): Promise<AxiosResponse<string>> => {
    const payload = { windowLocationOriginDomain: windowLocationOriginDomain, loginhint: loginHint };
    let url = `${baseAxiosUrl}/authenticationMetadata/GetAuthenticationUrlWithConfiguration`;
    return await axios.post(url, payload);
}

export const getClientId = async (): Promise<AxiosResponse<string>> => {
    let url = baseAxiosUrl + "/authenticationMetadata/getClientId";
    return await axios.get(url);
}