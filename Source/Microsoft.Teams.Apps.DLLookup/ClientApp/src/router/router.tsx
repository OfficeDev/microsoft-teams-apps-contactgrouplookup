// <copyright file="router.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ErrorPage from "../components/error-page/error-page";
import SignInPage from "../components/sign-in-page/sign-in-page";
import SignInSimpleStart from "../components/sign-in-page/sign-in-simple-start";
import SignInSimpleEnd from "../components/sign-in-page/sign-in-simple-end";
import DistributionLists from '../components/distribution-lists/distribution-lists';
import AddDistributionList from '../components/add-distribution-list/add-distribution-list';
import DistributionListMembers from '../components/distribution-list-members/distribution-list-members';
import GroupChatWarning from '../components/group-chat-warning/group-chat-warning';
import { createFavoriteDistributionList, getADDistributionLists, pinStatusUpdate, getDistributionListsMembers, getFavoriteDistributionLists, getDistributionListMembersOnlineCount, getUserPresence, getUserPageSizeChoice, createUserPageSizeChoice, getClientId } from '../apis/api-list';
import "../i18n";

export const AppRoute: React.FunctionComponent<{}> = () => {

    return (
        <Suspense fallback={<></>}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/dls" render={(props) => <DistributionLists {...props} getFavoriteDistributionLists={getFavoriteDistributionLists} getDistributionListMembersOnlineCount={getDistributionListMembersOnlineCount} getUserPageSizeChoice={getUserPageSizeChoice} createUserPageSizeChoice={createUserPageSizeChoice} getClientId={getClientId} />} />
                    <Route exact path="/dlmemberlist/:id/:name" render={(props) => <DistributionListMembers {...props} parentDlId={props.match.params.id} parentDLName={props.match.params.name} getDistributionListsMembers={getDistributionListsMembers} pinStatusUpdate={pinStatusUpdate} getUserPresence={getUserPresence} getUserPageSizeChoice={getUserPageSizeChoice} createUserPageSizeChoice={createUserPageSizeChoice} />} />
                    <Route exact path="/adfavorite/:isskypedl?" render={(props) => <AddDistributionList {...props} getADDistributionLists={getADDistributionLists} createFavoriteDistributionList={createFavoriteDistributionList} />} />
                    <Route exact path="/groupchatwarning/:count" render={(props) => <GroupChatWarning {...props} chatListCount={props.match.params.count} />} />
                    <Route exact path="/errorpage" component={ErrorPage} />
                    <Route exact path="/errorpage/:id" component={ErrorPage} />
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signin-simple-start" component={SignInSimpleStart} />
                    <Route exact path="/signin-simple-end" component={SignInSimpleEnd} />
                </Switch>
            </BrowserRouter>
        </Suspense>
    );
}