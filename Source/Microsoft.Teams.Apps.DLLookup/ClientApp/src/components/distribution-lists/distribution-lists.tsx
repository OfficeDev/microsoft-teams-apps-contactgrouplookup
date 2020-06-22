// <copyright file="distribution-lists.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { getBaseUrl } from '../../configVariables';
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader, Input, Button, Flex, Grid, Segment, FlexItem, Text, Dropdown, DropdownProps } from '@stardust-ui/react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { updateFavoriteDistributionList, deleteFavoriteDistributionList } from '../../apis/api-list';
import Pagination from '../pagination/pagination';
import { AxiosResponse } from "axios";
import './distribution-lists.scss';
import { IUserPageSizeChoice } from "./../distribution-list-members/distribution-list-members"
import { orderBy } from 'lodash';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

export interface ITaskInfo {
    title?: string;
    height: number;
    width: number;
    url?: string;
    fallbackUrl?: string;
}

export interface IDistributionList {
    id?: string;
    displayName: string;
    mail: string;
    contactsCount: number;
    onlineContactsCount: string;
    isPinned: boolean;
}

export interface IDBDistributionList {
    id: string;
    isPinned?: boolean;
}

export interface IDistributionListsProps extends WithTranslation{
    getFavoriteDistributionLists: () => Promise<AxiosResponse<IDistributionList[]>>;
    getDistributionListMembersOnlineCount: (groupId?: string) => Promise<AxiosResponse<string>>;
    getUserPageSizeChoice: () => Promise<AxiosResponse<IUserPageSizeChoice>>;
    createUserPageSizeChoice: (payload: {}) => Promise<AxiosResponse<void>>;
    getClientId: () => Promise<AxiosResponse<string>>;
}

export interface IDistributionListsState {
    distributionLists: IDistributionList[];
    masterDistributionLists: IDistributionList[];
    activePage: number;
    loader: boolean;
    pageSize: number;
    sortedColumn: string;
    sortDirection: string;
}

class DistributionLists extends React.Component<IDistributionListsProps, IDistributionListsState> {

    private isOpenTaskModuleAllowed: boolean;
    private historyArray: string[];
    private defaultPageSize: number = 20;
    private notYetFetchedText: string = "Not yet fetched";
    private readonly pageId: number = 1; //DistributionLists.tsx treating as Page id 1
    localize: TFunction;
    

    constructor(props: IDistributionListsProps) {
        super(props);
        this.localize = this.props.t;
        initializeIcons();
        this.escFunction = this.escFunction.bind(this);
        this.isOpenTaskModuleAllowed = true;
        this.historyArray = [];
        this.state = {
            distributionLists: [], //Active display data. 
            masterDistributionLists: [], // master copy of favorite distribution lists data
            loader: true,          //Indicates loader to display while data is loading 
            activePage: 0,         //Active page displaying. By default 0
            pageSize: this.defaultPageSize, //default page size
            sortedColumn: "displayName",
            sortDirection: "Down"
        };
    }

    public componentDidMount = () => {

        //Save Page URL to local storage to use for Back button in Distribution list members page
        const historyJson = localStorage.getItem("localStorageHistory");
        if (historyJson != null) {
            this.historyArray = JSON.parse(historyJson);
            if (this.historyArray.length > 0) {
                this.historyArray = [];
                this.historyArray.push(window.location.href);
                localStorage.setItem("localStorageHistory", JSON.stringify(this.historyArray));
            }
            else {
                this.historyArray.push(window.location.href);
                localStorage.setItem("localStorageHistory", JSON.stringify(this.historyArray));
            }
        }
        else {
            this.historyArray.push(window.location.href);
            localStorage.setItem("localStorageHistory", JSON.stringify(this.historyArray));
        }

        document.addEventListener("keydown", this.escFunction, false);
        this.getPageSize();
        this.dataLoad();
    }

    public componentWillUnmount = () => {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    //This function is to load data to state using API or from local storage.
    private dataLoad = () => {

        //To delete local storage copy
        if (localStorage.getItem('localStorageMasterDistributionListsTime') !== null) {
            let jsonFromLocalStorage = localStorage.getItem('localStorageMasterDistributionListsTime');
            if (jsonFromLocalStorage != null) {
                const dateFromLocalStorage: number = JSON.parse(jsonFromLocalStorage);
                const now = new Date().getTime();
                const diffInMinutes = Math.floor(Math.abs(dateFromLocalStorage - now) / 60000);
                if (diffInMinutes > 1) {
                    localStorage.removeItem('localStorageMasterDistributionListsTime');
                    localStorage.removeItem('localStorageMasterDistributionLists');
                }
            }
        }

        //To load data from local storage
        if (localStorage.getItem('localStorageMasterDistributionLists') !== null) {
            const jsonFromLocalStorage = localStorage.getItem('localStorageMasterDistributionLists');
            if (jsonFromLocalStorage != null) {
                const distributionLists: IDistributionList[] = JSON.parse(jsonFromLocalStorage);
                this.setState({
                    distributionLists: distributionLists,
                    masterDistributionLists: distributionLists,
                    loader: false,
                },
                    () => {
                        this.getAllDistributionListMembersOnlineCount();
                    })
            }
        }
        else {
            //To load data from server
            this.props.getFavoriteDistributionLists().then((response: AxiosResponse<IDistributionList[]>) => {
                const favorites = response.data;
                let distributionLists: IDistributionList[] = [];
                for (let i = 0; i < favorites.length; i++) {
                    distributionLists.push({
                        id: favorites[i].id,
                        displayName: favorites[i].displayName,
                        mail: favorites[i].mail,
                        contactsCount: favorites[i].contactsCount,
                        onlineContactsCount: this.notYetFetchedText,
                        isPinned: favorites[i].isPinned,
                    });
                }

                distributionLists = this.resetSorting(distributionLists);

                if (favorites.length !== 0) {
                    //If favorite distribution lists exists
                    this.setState({
                        distributionLists: distributionLists,
                        masterDistributionLists: distributionLists,
                        loader: false,
                    });
                    const now = new Date().getTime();
                    localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(distributionLists));
                    localStorage.setItem("localStorageMasterDistributionListsTime", JSON.stringify(now));
                    this.getAllDistributionListMembersOnlineCount();
                }
                else {
                    this.setState({
                        loader: false,
                    })
                }
            });
        }
    }

    //Calling respective method, if online count is not fetched yet.
    private getAllDistributionListMembersOnlineCount = async () => {
        this.state.masterDistributionLists.forEach((currentDistributionList) => {
            if (currentDistributionList.onlineContactsCount === this.notYetFetchedText) {
                this.getDistributionListMembersOnlineCountAsync(currentDistributionList);
            }
        })
    }

    //Call API to get online count 
    private getDistributionListMembersOnlineCountAsync = async (distributionList: IDistributionList) => {
        this.props.getDistributionListMembersOnlineCount(distributionList.id).then((response: AxiosResponse<string>) => {

            //Setting state for master distribution List
            this.setState(state => {
                const masterDistributionLists: IDistributionList[] = state.masterDistributionLists.map((currentItem) => {
                    if (distributionList.id === currentItem.id) {
                        currentItem.onlineContactsCount = response.data;
                    }
                    return currentItem;
                });
                return {
                    masterDistributionLists,
                };
            });

            //Setting state for distribution list
            this.setState(state => {
                const distributionLists: IDistributionList[] = state.distributionLists.map((currentItem) => {

                    if (distributionList.id === currentItem.id) {
                        currentItem.onlineContactsCount = response.data;
                    }
                    return currentItem;
                });
                return {
                    distributionLists,
                };
            });

            localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(this.state.masterDistributionLists));
        });
    }

    // To delete/Hide from favorites
    private deleteFavorites = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        let distributionListId = (e.target as Element).id;
        const masterDistributionLists = (this.state.masterDistributionLists.filter((distributionList: IDistributionList) => { return distributionList.id !== distributionListId }));
        const distributionLists = (this.state.distributionLists.filter((distributionList: IDistributionList) => { return distributionList.id !== distributionListId }));

        const userHideRecord: IDBDistributionList = {
            id: distributionListId,
        };

        // Calling api to delete from favorite distribution lists
        deleteFavoriteDistributionList(userHideRecord).then(response => {
            if (response.status === 200) {
                this.setState({
                    distributionLists: distributionLists,
                    masterDistributionLists: masterDistributionLists,
                })
                localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(this.state.masterDistributionLists));
            }
        });
    }

    //To change record Pin/Unpin status
    private changePinStatus = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const distributionListId = (e.target as Element).id;
        const distributionList = (this.state.distributionLists.filter((list: IDistributionList) => { return list.id === distributionListId }));
        const pinStatus = !distributionList[0].isPinned;

        const userPinChangeRecord: IDBDistributionList = {
            id: distributionListId,
            isPinned: pinStatus,
        };

        //Call api to update Pin status in database
        updateFavoriteDistributionList(userPinChangeRecord).then(response => {
            let favorites = this.state.distributionLists;
            let masterFavorites = this.state.masterDistributionLists;

            //Update pin status to local copy
            for (let i = 0; i < favorites.length; i++) {
                if (distributionListId === favorites[i].id)
                    favorites[i].isPinned = pinStatus;
            }

            //Update pin status to local master copy
            for (let i = 0; i < masterFavorites.length; i++) {
                if (distributionListId === masterFavorites[i].id)
                    masterFavorites[i].isPinned = pinStatus;
            }

            if (response.status === 200) {
                this.setState({
                    distributionLists: this.resetSorting(favorites),
                    masterDistributionLists: this.resetSorting(masterFavorites),
                })
                localStorage.setItem("localStorageMasterDistributionLists", JSON.stringify(this.state.masterDistributionLists));
            }
        });
    }

    //#region "Sorting functions"

    //Calling appropriate function based on column selected for sorting
    private sortDataByColumn = (column: string) => {
        let directionBool = false;
        if (this.state.sortedColumn !== column) {
            this.setState({
                sortedColumn: column,
                sortDirection: "Down"
            });
            directionBool = true;
        } else if (this.state.sortedColumn === column) {
            const direction = this.state.sortDirection === "Up" ? "Down" : "Up";
            this.setState({
                sortedColumn: column,
                sortDirection: direction
            });
            directionBool = this.state.sortDirection === "Up" ? true : false;
        }
        this.sortColumnItems(column, directionBool)
    }

    //Setting the sort icons and sorting pinned-unpinned records separately
    private sortColumnItems = (sortColumn: string, sortOrder: boolean) => {

        let pinnedRecords = this.state.distributionLists.filter((e: IDistributionList) => e.isPinned === true);
        let unpinnedRecords = this.state.distributionLists.filter((e: IDistributionList) => e.isPinned === false);
        pinnedRecords = orderBy(pinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
        unpinnedRecords = orderBy(unpinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);

        const distributionLists = pinnedRecords.concat(unpinnedRecords); //Concatenate both

        this.setState({
            distributionLists: distributionLists,
        })

    }

    //Reset Sorting on data reload
    private resetSorting = (favoriteDLs: IDistributionList[]) => {
        let pinnedRecords = favoriteDLs.filter((e: IDistributionList) => e.isPinned === true);
        let unpinnedRecords = favoriteDLs.filter((e: IDistributionList) => e.isPinned === false);
        let sortColumn = this.state.sortedColumn; //Default sort Column

        pinnedRecords = orderBy(pinnedRecords, [sortColumn], ["asc"]);
        unpinnedRecords = orderBy(unpinnedRecords, [sortColumn], ["asc"]);

        favoriteDLs = pinnedRecords.concat(unpinnedRecords);
        return favoriteDLs;
    }
    //#endregion "Sorting functions"

    //#region "Search function"
    private searchFavoriteDLs = (e: React.SyntheticEvent<HTMLElement, Event>) => {
        let searchQuery = (e.target as HTMLInputElement).value;
        if (!searchQuery) // If Search text cleared
        {
            this.setState({
                distributionLists: this.state.masterDistributionLists,
            })
        }
        else {
            this.setState({
                distributionLists: this.state.masterDistributionLists.filter((list: IDistributionList) => list.displayName.toLowerCase().includes(searchQuery.toLowerCase())),
                activePage: 0, // Active page reset on search
            })
        }
        this.getAllDistributionListMembersOnlineCount();
    }
    //#endregion "Search function"

    //This function call back from Paging component
    private setActivePage = (newPageNumber: number) => {
        this.setState({
            activePage: newPageNumber,
        })
    }

    //Get Page size from database/local storage
    private getPageSize = async () => {
        if (localStorage.getItem('localStorageDLPageSizeValue') === null || localStorage.getItem('localStorageDLPageSizeValue') === undefined) {
            this.props.getUserPageSizeChoice().then((response: AxiosResponse<IUserPageSizeChoice>) => {
                if (response.data) {
                    this.setState({
                        pageSize: response.data.distributionListPageSize === 0 ? this.defaultPageSize : response.data.distributionListPageSize
                    });
                    localStorage.setItem('localStorageDLPageSizeValue', response.data.distributionListPageSize === 0 ? this.defaultPageSize.toString() : response.data.distributionListPageSize.toString());
                    localStorage.setItem('localStorageDLMembersPageSizeValue', response.data.distributionListMemberPageSize === 0 ? this.defaultPageSize.toString() : response.data.distributionListMemberPageSize.toString());
                }
                else {
                    localStorage.setItem('localStorageDLPageSizeValue', this.defaultPageSize.toString());
                    localStorage.setItem('localStorageDLMembersPageSizeValue', this.defaultPageSize.toString());
                }

            });
        }
        else {
            this.setState({
                pageSize: Number(localStorage.getItem('localStorageDLPageSizeValue'))
            });
        }
    }

    //setting page size
    private setPageSize = (e: React.SyntheticEvent<HTMLElement, Event>, pageSizeDropdownProps?: DropdownProps) => {
        this.setState({
            pageSize: Number(pageSizeDropdownProps!.value),
            activePage: 0
        });
        this.props.createUserPageSizeChoice({
            "PageId": this.pageId,
            "PageSize": pageSizeDropdownProps!.value
        }).then((response: AxiosResponse<void>) => {
            localStorage.setItem('localStorageDLPageSizeValue', (pageSizeDropdownProps!.value || this.defaultPageSize).toString());
        })
    }

    //To open "Add Distribution list" task module
    public onOpenTaskModule = () => {
        if (this.isOpenTaskModuleAllowed) {
            this.isOpenTaskModuleAllowed = false;
            const url = getBaseUrl() + "/adfavorite";
            const taskInfo: ITaskInfo = {
                url: url,
                title: this.localize('addFavoriteDistributionList'),
                height: 650,
                width: 700,
                fallbackUrl: url,
            }

            const submitHandler = (err: string, result: any) => {
                this.isOpenTaskModuleAllowed = true;
                if (result != null) {
                    if (result.output === "success") {
                        localStorage.removeItem('localStorageMasterDistributionListsTime');
                        localStorage.removeItem('localStorageMasterDistributionLists');
                        this.dataLoad();
                    }
                }
                else {
                    this.setState({
                        loader: false,
                    })
                }

            };

            microsoftTeams.tasks.startTask(taskInfo, submitHandler);
        }
    }

    //Handles escape function
    private escFunction = (e: KeyboardEvent) => {
        if (e.keyCode === 27 || (e.key === "Escape")) {
            microsoftTeams.tasks.submitTask();
        }
    }

    public render(): JSX.Element {
        //Page size drop down values.
        const pageSize = [20, 50, 100];
        let index = pageSize.indexOf(this.state.pageSize);
        let items = []; //Populate grid items
        for (let j: number = this.state.activePage * this.state.pageSize; j < (this.state.activePage * this.state.pageSize) + this.state.pageSize; j++)  // 20 is records per page
        {
            if (j >= this.state.distributionLists.length) // If it crosses last record
                break;

            items.push(<Segment className="border-none">
                <Flex gap="gap.small">
                    <FlexItem>
                        <Text onClick={() => window.open("/dlmemberlist/" + this.state.distributionLists[j].id + "/" + this.state.distributionLists[j].displayName, "_self")} content={this.state.distributionLists[j].displayName} title={this.localize('viewDetails')} className="title" />
                    </FlexItem>
                    <FlexItem>
                        <Icon iconName="Pinned" hidden={!this.state.distributionLists[j].isPinned} className="disable-pin" />
                    </FlexItem>
                </Flex>
            </Segment>)
            items.push(<Segment content={this.state.distributionLists[j].mail} className="border-none"></Segment>)
            items.push(<Segment content={this.state.distributionLists[j].contactsCount} className="border-none"></Segment>)

            if (this.state.distributionLists[j].onlineContactsCount === this.notYetFetchedText)
                items.push(<Segment className="border-none"><Loader size="smallest" /> </Segment>)
            else
                items.push(<Segment className="border-none"><Text content={this.state.distributionLists[j].onlineContactsCount} /></Segment>)

            items.push(<Segment className="border-none actions-style">
                <Flex gap="gap.small">
                    <Icon iconName={!this.state.distributionLists[j].isPinned ? "Pinned" : "Unpin"} title={!this.state.distributionLists[j].isPinned ? this.localize('pin') : this.localize('unpin')} className="seperator-spacing" id={this.state.distributionLists[j].id} onClick={this.changePinStatus}>
                    </Icon>&nbsp;
                    <Icon iconName="Delete" title={this.localize('delete')} className="seperator-spacing" id={this.state.distributionLists[j].id} onClick={this.deleteFavorites}>
                    </Icon>
                </Flex>
            </Segment>)
        }

        let segmentRows = []; //Populate grid 
        if (this.state.loader) {
            segmentRows.push(<Segment styles={{ gridColumn: 'span 5', }}>< Loader /></Segment >);
        }
        else {
            segmentRows.push(items);
        }

        if (!this.state.loader && this.state.distributionLists.length === 0 && this.state.masterDistributionLists.length === 0)// If there are no favorites saved
        {
            return (<div className={"emptydiv"}>
                <Text content={this.localize('welcomeMessage')} className="welcome-text" />
                <br />
                <br />
                <Text content={this.localize('getStarted')} className="get-started" />
                <br />
                <br />
                <Button content={this.localize('addDistributionList')} onClick={() => this.onOpenTaskModule()} primary />
                <br />
                <br />
            </div>);
        }
        else {
            return (
                <div className="main-component" key="dlkey">
                    <div className={"form-container"}>
                        <Flex space="between">
                            <FlexItem grow>
                                <Text content={this.localize('distributionListsTitle')} size={"larger"} weight="semibold" className="textstyle">
                                    {this.localize('distributionListsTitle')}<Icon title={this.localize('appInfo')} className="info-icon" iconName="Info" />
                                </Text>
                            </FlexItem >
                            
                            <Flex gap="gap.small">
                                <div className="div-style">
                                    <Dropdown
                                        className="bg-color"
                                        fluid={true}
                                        items={pageSize}
                                        placeholder={this.localize('pageSizeGroups')}
                                        highlightedIndex={index}
                                        onSelectedChange={this.setPageSize}
                                        checkable
                                    /></div>
                                <Input aria-label={this.localize('search')} icon="search" placeholder={this.localize('search')} onChange={this.searchFavoriteDLs} className="search-box" />
                                <Button aria-label={this.localize('addDistributionList')} content={this.localize('addDistributionList')} onClick={() => this.onOpenTaskModule()} primary />
                            </Flex>
                        </Flex>
                        <br />
                        <div className="form-content-container" >
                            <Grid columns="2.3fr 2fr 1.3fr 1.3fr 1.5fr">
                                <Segment color="brand" className="header">
                                    <Flex gap="gap.small">
                                        <FlexItem>
                                            <Text content={this.localize('headerName')} className="text-style" />
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName={this.state.sortedColumn == "displayName" ? this.state.sortDirection : ""} className="title-sort-icon">
                                            </Icon>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName="ChevronDown" className="title-sort-icon" onClick={() => this.sortDataByColumn("displayName")}>
                                            </Icon>
                                        </FlexItem>
                                    </Flex>
                                </Segment>

                                <Segment color="brand" className="header">
                                    <Flex gap="gap.small">
                                        <FlexItem>
                                            <Text content={this.localize('headerAlias')} className="text-style"/>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon className="text-style" iconName={this.state.sortedColumn == "mail" ? this.state.sortDirection : ""}>
                                            </Icon>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName="ChevronDown" className="title-sort-icon" onClick={() => this.sortDataByColumn("mail")}>
                                            </Icon>
                                        </FlexItem>
                                    </Flex>
                                </Segment>

                                <Segment color="brand" className="header">
                                    <Flex gap="gap.small">
                                        <FlexItem>
                                            <Text content={this.localize('headerMembersCount')} className="text-style"/>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName={this.state.sortedColumn == "contactsCount" ? this.state.sortDirection : ""}>
                                            </Icon>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName="ChevronDown" className="title-sort-icon" onClick={() => this.sortDataByColumn("contactsCount")}>
                                            </Icon>
                                        </FlexItem>
                                    </Flex>
                                </Segment>

                                <Segment color="brand" className="header">
                                    <Flex gap="gap.small">
                                        <FlexItem>
                                            <Text content={this.localize('headerMembersOnline')} className="text-style"/>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName={this.state.sortedColumn == "onlineContactsCount" ? this.state.sortDirection : ""}>
                                            </Icon>
                                        </FlexItem>
                                        <FlexItem>
                                            <Icon iconName="ChevronDown" className="title-sort-icon" onClick={() => this.sortDataByColumn("onlineContactsCount")}>
                                            </Icon>
                                        </FlexItem >
                                    </Flex>
                                </Segment>

                                <Segment color="brand" className="header">
                                    <Flex gap="gap.small">
                                    </Flex>
                                </Segment>

                                {segmentRows}

                            </Grid>
                        </div>
                    </div>
                    <div className="footer-container">
                        <Segment className={"paging-segment"}>
                            <Flex gap="gap.small">
                                <Pagination callbackFromParent={this.setActivePage} entitiesLength={this.state.distributionLists.length} activePage={this.state.activePage} numberOfContents={this.state.pageSize}></Pagination>
                            </Flex>
                        </Segment>
                    </div>
                </div>
            );
        }
    }
}
export default withTranslation()(DistributionLists) 