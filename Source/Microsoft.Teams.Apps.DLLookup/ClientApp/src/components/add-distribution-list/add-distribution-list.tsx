// <copyright file="add-distribution-list.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { Input, Button, Flex, Grid, Segment, FlexItem, Text, Checkbox, Loader, ButtonProps, CheckboxProps } from '@stardust-ui/react';
import "./add-distribution-list.scss";
import { AxiosResponse } from "axios";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

export interface IADDistributionList {
    id: string;
    displayName: string
    mail: string
    isSelected: boolean
}

export interface IUserFavoriteDistributionList {
    id: string;
    isPinned: boolean
}

export interface IADDistributionListsProps extends WithTranslation {
    getADDistributionLists: (query: string) => Promise<AxiosResponse<IADDistributionList[]>>;
    createFavoriteDistributionList: (payload: {}) => Promise<AxiosResponse<void>>;
}

export interface IADDistributionListsState {
    searchResultDistributionLists: IADDistributionList[];
    loader: boolean;
    searchQuery: string,
    isHeaderSelected: boolean,
}

//exporting AddDistributionList Component;
class AddDistributionList extends React.Component<IADDistributionListsProps, IADDistributionListsState> {

    private searchButtonClicked: boolean = false;
    localize: TFunction;

    constructor(props: IADDistributionListsProps) {
        super(props);
        this.localize = this.props.t;
        const { t } = this.props;
        initializeIcons();
        this.state = {
            searchResultDistributionLists: [],
            loader: false,
            searchQuery: "",
            isHeaderSelected: false
        };
    };

    public componentDidMount = () => {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    public componentWillUnmount = () => {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    //Load distribution lists from skype contacts or based on search.
    private dataLoad = () => {
        this.setState({
            loader: true
        });

        //If it is to import distribution lists from skype contacts
        if (this.state.searchQuery) { // If it is based on search
            this.props.getADDistributionLists(this.state.searchQuery).then((response: AxiosResponse<IADDistributionList[]>) => {
                let distributionLists: IADDistributionList[] = [];

                response.data.forEach((currentItem: IADDistributionList) => {
                    distributionLists.push({
                        id: currentItem.id,
                        displayName: currentItem.displayName,
                        mail: currentItem.mail,
                        isSelected: false,
                    });
                });

                this.setState({
                    searchResultDistributionLists: distributionLists,
                    loader: false
                });

            });
        }
    }

    private onSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let searchQuery = (e.target as HTMLInputElement).value;
        this.setState({
            searchQuery: searchQuery
        });
        if (e.keyCode === 13 || (e.key === "Enter")) {
            if (searchQuery) {
                this.searchButtonClicked = true;
                this.dataLoad();
            }
        }
    }

    //To Search data
    private onSearchButtonClick = (e: React.SyntheticEvent<HTMLElement, Event>, v?: ButtonProps) => {
        if (this.state.searchQuery) {
            this.searchButtonClicked = true;
            this.dataLoad();
        }
    }

    //When user selected check box, call this function to track checked records
    private onCheckBoxSelect = (e: React.SyntheticEvent<HTMLElement, Event>, checkBoxProps?: CheckboxProps) => {
        let distributionLists: IADDistributionList[] = [];
        let headerCheckBoxSelection = true;
        const selectedChkId = (e.currentTarget as Element).id;

        this.state.searchResultDistributionLists.forEach((currentItem) => {

            if (currentItem.id === selectedChkId) {
                currentItem.isSelected = checkBoxProps!.checked ? checkBoxProps!.checked : false;
            }
            distributionLists.push(currentItem);

            if (!currentItem.isSelected) {
                headerCheckBoxSelection = false;
            }
        });

        this.setState({
            searchResultDistributionLists: distributionLists,
            isHeaderSelected: headerCheckBoxSelection
        });
    }

    //When Select All check box selected
    private onAllCheckBoxSelect = (e: React.SyntheticEvent<HTMLElement, Event>, checkBoxProps?: CheckboxProps) => {
        const headerCheckBoxSelection = checkBoxProps!.checked ? checkBoxProps!.checked : false;
        let distributionLists: IADDistributionList[] = [];
        this.state.searchResultDistributionLists.forEach((currentItem) => {
            currentItem.isSelected = headerCheckBoxSelection
            distributionLists.push(currentItem);
        });

        this.setState({
            searchResultDistributionLists: distributionLists,
            isHeaderSelected: headerCheckBoxSelection
        });
    }

    private escFunction = (e: KeyboardEvent) => {
        if (e.keyCode === 27 || (e.key === "Escape")) {
            microsoftTeams.tasks.submitTask({ "output": "failure" });
        }
    }

    //To add selected distribution lists to favorites.
    private onAddButtonClick = () => {
        let userFavoriteDistributionLists: IUserFavoriteDistributionList[] = [];

        this.state.searchResultDistributionLists.forEach((currentItem) => {
            if (currentItem.isSelected) {
                const userFavoriteDistributionList: IUserFavoriteDistributionList = {
                    id: currentItem.id,
                    isPinned: false,
                };
                userFavoriteDistributionLists.push(userFavoriteDistributionList);
            }
        });

        //Call API to save selected distribution lists to database
        this.postUserFavoriteDistributionLists(userFavoriteDistributionLists).then(() => {
            microsoftTeams.tasks.submitTask({ "output": "success" }); //Close task module on saving
        });
    }

    //Call API to save selected distribution lists to database
    private postUserFavoriteDistributionLists = async (userFavoriteDistributionLists: IUserFavoriteDistributionList[]) => {
        try {
            await this.props.createFavoriteDistributionList(userFavoriteDistributionLists);
        } catch (error) {
            return error;
        }
    }

    public render(): JSX.Element {
        const gridStyle = { width: '100%' };
        if (this.state.loader) {
            return (
                <Loader />
            );
        }
        else {
            const searchResultDistributionLists = this.state.searchResultDistributionLists;
            let segmentRows: {}[] = [];
            searchResultDistributionLists.forEach((currentDL) => {
                segmentRows.push(<Segment className="border-none task-module-border">
                    <Checkbox id={currentDL.id} label={currentDL.displayName} onChange={this.onCheckBoxSelect} checked={currentDL.isSelected} />
                </Segment>);
                segmentRows.push(<Segment content={currentDL.mail} className="border-none task-module-border"></Segment>);
            });

            if (this.state.searchResultDistributionLists.length <= 0) {
                
                return (<div className="task-module">
                    <div className="form-container">
                        <Flex gap="gap.small" className="search-div">
                            <FlexItem grow>
                                <Input className="inputField" icon="search" fluid placeholder={this.localize("searchByDlName")} onKeyUp={this.onSearchKeyUp} name="txtSearch" clearable />
                            </FlexItem>
                            <FlexItem push>
                                <Button content={this.localize("search")} onClick={this.onSearchButtonClick} primary />
                            </FlexItem>

                        </Flex>
                        <div className="search-not-found" hidden={!this.searchButtonClicked}>
                            {this.localize('noSearchResults')}
                        </div>
                    </div>
                </div>);
            }
            else {

                return (

                    <div className="task-module">
                        <div className="form-container">
                            <Flex gap="gap.small" className="search-div">
                                <FlexItem grow>
                                    <Input icon="search" className="inputField" fluid placeholder={this.localize('searchByDlName')} onKeyUp={this.onSearchKeyUp} name="txtSearch" clearable />
                                </FlexItem>
                                <FlexItem push>
                                    <Button content={this.localize("search")} onClick={this.onSearchButtonClick} primary />
                                </FlexItem>
                            </Flex>
                            <div className="form-content-container" >
                                <Grid columns="2.5fr 3fr " styles={{ width: "100%", border: "0 !important" }} >
                                    <Segment color="brand" className="header task-module-border dark-theme" >
                                        <Flex gap="gap.small" className="dark-theme">
                                            <FlexItem>
                                                <Checkbox className="dark-theme" key="name" id="chkAll" label={this.localize("headerName")} onChange={this.onAllCheckBoxSelect} checked={this.state.isHeaderSelected} />
                                            </FlexItem>
                                        </Flex>
                                    </Segment>
                                    <Segment color="brand" className="header task-module-border">
                                        <Flex gap="gap.small">
                                            <FlexItem>
                                                <Text className="dark-theme" content={this.localize("headerAlias")} />
                                            </FlexItem>
                                        </Flex>
                                    </Segment>
                                    {segmentRows}
                                </Grid>
                            </div>
                            <div className="footer-container">
                                <div className="button-container">
                                    <Button content={this.localize("add")} onClick={this.onAddButtonClick} primary className="bottomButton" />
                                </div>
                            </div>

                        </div>
                    </div>
                );
            }

        }
    }
}

export default withTranslation()(AddDistributionList) 
