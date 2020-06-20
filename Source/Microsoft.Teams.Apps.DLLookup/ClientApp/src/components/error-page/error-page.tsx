// <copyright file="error-page.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Text } from '@stardust-ui/react';
import './error-page.scss';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";


interface IErrorPageProps extends WithTranslation, RouteComponentProps {
}

class ErrorPage extends React.Component<IErrorPageProps, {}> {
    localize: TFunction;

    constructor(props: any) {
        super(props);
        this.localize = this.props.t;
    }

    public render(): JSX.Element {
        const params = this.props.match.params;
        let message = this.localize("generalErrorMessage");
        if ("id" in params) {
            const id = params["id"];
            if (id === "401") {
                message = this.localize("unauthorizedErrorMessage");
            } else if (id === "403") {
                message = this.localize("forbiddenErrorMessage");
            }
            else {
                message = this.localize("generalErrorMessage");
            }
        }
        return (
            <Text content={message} className="error-message" error size="medium" />
        );
    }
}

export default withTranslation()(ErrorPage)
