// <copyright file="group-chat-warning.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { Button, Flex, ButtonProps } from '@stardust-ui/react';
import * as microsoftTeams from "@microsoft/teams-js";
import './group-chat-warning.scss';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

export interface IGroupChatWarningProps extends WithTranslation{
    chatListCount: string
}

class GroupChatWarning extends React.Component<IGroupChatWarningProps, {}> {
    localize: TFunction;
    constructor(props: IGroupChatWarningProps) {
        super(props);
        this.localize = this.props.t;
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    //#region "React Life Cycle Hooks"
    public componentDidMount = () => {
        microsoftTeams.initialize();
    }
    //#endregion

    //#region "On Button Click"
    private onButtonClick = (e: React.SyntheticEvent<HTMLElement, Event>, v?: ButtonProps) => {
        microsoftTeams.tasks.submitTask({ "response": (e.currentTarget as Element).id });
    }
    //#endregion

    public render(): JSX.Element {
        let styles = { padding: '5%' };
        return (
            <div style={styles}>
                <Flex>
                    <div>
                        <p>{this.localize("groupChatMessage")}</p>
                        <p>{this.localize("groupChatCountMessage", this.props.chatListCount)}</p>
                        <p>{this.localize("groupChatRecentMembers")}</p>
                    </div>
                </Flex>
                <div className="footer-container">
                    <div className="button-container">
                        <Button key="decline" id="NO" value="NO" onClick={this.onButtonClick}>{this.localize("no")}</Button><Button key="accept" className="start-chat" id="YES" value="YES" primary onClick={this.onButtonClick}>{this.localize("yes")}</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTranslation()(GroupChatWarning) 