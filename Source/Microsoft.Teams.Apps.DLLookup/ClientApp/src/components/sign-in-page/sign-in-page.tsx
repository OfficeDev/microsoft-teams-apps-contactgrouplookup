// <copyright file="sign-in-page.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Text, Button } from "@stardust-ui/react";
import * as microsoftTeams from "@microsoft/teams-js";
import "./sign-in-page.scss";
import { useTranslation } from "react-i18next"

const SignInPage: React.FunctionComponent<RouteComponentProps> = props => {
    const localize = useTranslation().t;

    function onSignIn(): void {
        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/signin-simple-start",
            successCallback: () => {
                console.log("Login succeeded!");
                window.location.href = "/dls";
            },
            failureCallback: (reason) => {
                console.log("Login failed: " + reason);
                window.location.href = "/errorpage";
            }
        });
    }

    return (
        <div className="sign-in-content-container">
            <Text
                content={localize('signInMessage')}
                size="medium"
            />
            <div className="space"></div>
            <Button content={localize('signIn')} primary className="sign-in-button" onClick={onSignIn} />
        </div>
    );
};

export default SignInPage;
