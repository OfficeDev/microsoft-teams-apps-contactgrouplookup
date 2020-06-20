// <copyright file="App.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import './App.scss';
import { Provider, themes } from '@stardust-ui/react';
import * as microsoftTeams from "@microsoft/teams-js";
import { AppRoute } from "./router/router";

export interface IAppState {
    theme: string;
}

class App extends React.Component<{}, IAppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            theme: "",
        }
    }

    public componentDidMount = () => {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context) => {
            let theme = context.theme || "";
            this.setState({
                theme: theme
            });
        });

        microsoftTeams.registerOnThemeChangeHandler((theme) => {
            this.setState({
                theme: theme,
            }, () => {
                this.forceUpdate();
            });
        });
    }

    public setThemeComponent = () => {
        if (this.state.theme === "dark") {
            return (
                <Provider theme={themes.teamsDark}>
                    <div className="darkContainer">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
        else if (this.state.theme === "contrast") {
            return (
                <Provider theme={themes.teamsHighContrast}>
                    <div className="highContrastContainer">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        } else {
            return (
                <Provider theme={themes.teams}>
                    <div className="default-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
    }

    public getAppDom = () => {
        return (

                <div className="app-container">
                     <AppRoute />
                </div>
        );
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.setThemeComponent()}
            </div>
        );
    }
}

export default App;