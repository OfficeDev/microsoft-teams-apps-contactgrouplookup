// <copyright file="distribution-list-members.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { getBaseUrl } from '../../configVariables';
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader, Flex, Text, Segment, FlexItem, Checkbox, Button, Grid, Input, Dropdown, DropdownProps, CheckboxProps } from '@stardust-ui/react';
import { faCheckCircle, faCircle, faMinusCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '../pagination/pagination';
import './distribution-list-members.scss';
import { chunk } from 'lodash';
import { AxiosResponse } from "axios";
import { orderBy } from 'lodash';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

export interface ITaskInfo {
    title?: string;
    height: number;
    width: number;
    url: string;
    fallbackUrl: string;
}

export interface IDistributionListMember {
    id: string;
    displayName: string;
    jobTitle: string;
    mail: string;
    userPrincipalName: string;
    isPinned: boolean;
    presence: string;
    isSelected: boolean;
    isGroup: boolean;
    sortOrder: number;
    type: string;
}

export interface IPresenceData {
    userPrincipalName: string;
    availability: string;
    availabilitySortOrder: number;
    id: string;
}

export interface IUserPageSizeChoice {
    distributionListPageSize: number;
    distributionListMemberPageSize: number;
}

export interface IDistributionListMembersProps extends WithTranslation {
    parentDlId: string;
    parentDLName: string;
    getDistributionListsMembers: (groupId?: string) => Promise<AxiosResponse<IDistributionListMember[]>>;
    pinStatusUpdate: (pinnedUser: string, status: boolean, distributionListId: string) => Promise<AxiosResponse<void>>;
    getUserPresence: (payload: {}) => Promise<AxiosResponse<IPresenceData[]>>;
    createUserPageSizeChoice: (payload: {}) => Promise<AxiosResponse<void>>;
    getUserPageSizeChoice: () => Promise<AxiosResponse<IUserPageSizeChoice>>;
}

export interface IDistributionListMembersState {
    distributionListMembers: IDistributionListMember[];
    loader: boolean;
    activePage: number;
    masterDistributionListMembers: IDistributionListMember[];      //Copy of DL MemberList
    isAllSelectChecked: boolean;
    pageSize: number;
    isGoBackClicked: boolean;
    sortedColumn: string;
    sortDirection: string;
}

//Exporting DistributionListMembers component
class DistributionListMembers extends React.Component<IDistributionListMembersProps, IDistributionListMembersState> {

    private isOpenTaskModuleAllowed: boolean;
    private checkedMembersForChat: IDistributionListMember[];
    private historyArray: string[];
    private batchRequestLimit: number = 40;
    private groupChatMembersLimit: number = 100;
    private defaultPageSize: number = 400;
    private notYetFetchedText: string = "Not yet fetched";
    private readonly taskModulePositiveResponseString: string = "YES";
    private readonly availabilityStatusOnline: string = "Available";
    private readonly pageId: number = 2; //DistributionListMembers.tsx treating as Page id 2
    private readonly chatUrl: string = "https://teams.microsoft.com/l/chat/0/0?users=";
    localize: TFunction;

    constructor(props: IDistributionListMembersProps) {
        super(props);
        this.localize = this.props.t;
        initializeIcons();
        this.isOpenTaskModuleAllowed = true;
        this.checkedMembersForChat = [];
        this.historyArray = [];
        this.state = {
            distributionListMembers: [],
            loader: true,
            activePage: 0,
            masterDistributionListMembers: [],
            isAllSelectChecked: false,
            pageSize: this.defaultPageSize,
            isGoBackClicked: false,
            sortedColumn: "displayName",
            sortDirection: "Down"
        };
        this.checkboxChanged = this.checkboxChanged.bind(this);
        this.selectAllCheckboxChanged = this.selectAllCheckboxChanged.bind(this);
        this.pinStatusUpdate = this.pinStatusUpdate.bind(this);
        this.groupChatWithMembers = this.groupChatWithMembers.bind(this);
        this.oneOnOneChat = this.oneOnOneChat.bind(this);
    }

    public componentDidMount = () => {
        const historyJson = localStorage.getItem("localStorageHistory");
        if (historyJson != null) {
            this.historyArray = JSON.parse(historyJson);
            this.historyArray.push(window.location.href);
            localStorage.setItem("localStorageHistory", JSON.stringify(this.historyArray));
        }
        else {
            this.historyArray.push(window.location.href);
            localStorage.setItem("localStorageHistory", JSON.stringify(this.historyArray));
        }

        this.getPageSize();

        this.dataLoad();
        this.resetSorting(this.state.distributionListMembers);
    }

    //This function is to load data to state using API.
    private dataLoad = () => {

        //API call to get the members of group
        this.props.getDistributionListsMembers(this.props.parentDlId).then((response: AxiosResponse<IDistributionListMember[]>) => {
            const members = response.data;
            let distributionListMembersTemp: IDistributionListMember[] = [];
            for (let i = 0; i < members.length; i++) {
                distributionListMembersTemp.push(
                    {
                        id: members[i].id,
                        displayName: members[i].displayName,
                        jobTitle: members[i].jobTitle === null ? "" : members[i].jobTitle,
                        userPrincipalName: members[i].userPrincipalName,
                        mail: members[i].mail,
                        presence: (members[i].type === "#microsoft.graph.group") ? "" : this.notYetFetchedText,
                        isPinned: members[i].isPinned,
                        isSelected: false,
                        isGroup: members[i].type === "#microsoft.graph.group",
                        sortOrder: 10,//Any number greater than 5 is fine,
                        type: members[i].type
                    }
                );
            }
            this.resetSorting(distributionListMembersTemp);
            this.getAllUserPresenceAsync();
            this.setState({
                loader: false
            });
        });
    }

    //To get group members presence information
    private getAllUserPresenceAsync = async () => {
        let presenceDataList: IPresenceData[] = [];

        this.state.masterDistributionListMembers.forEach((currentDistributionListMember) => {

            if (currentDistributionListMember.presence === this.notYetFetchedText) {
                presenceDataList.push({
                    userPrincipalName: currentDistributionListMember.userPrincipalName,
                    availability: "",
                    availabilitySortOrder: 0,
                    id: currentDistributionListMember.id
                });
            }
        });

        let batchRequests = chunk(presenceDataList, this.batchRequestLimit);
        for (let i = 0; i < batchRequests.length; i++) {
            this.getUserPresenceAsync(batchRequests[i]);
        }
    }

    //To get user presence
    private getUserPresenceAsync = async (iPresenceDataList: IPresenceData[]) => {
        this.props.getUserPresence(iPresenceDataList).then((response: AxiosResponse<IPresenceData[]>) => {
            const presenceDataList: IPresenceData[] = response.data;

            //Set the state for user presence in master distribution list
            const masterDistributionListMembers = this.state.masterDistributionListMembers.map((currentItem) => {
                if (currentItem.userPrincipalName != null) {
                    let presenceDetailsOfCurrentItem = presenceDataList.find((currentPresenceRecord: IPresenceData) => currentPresenceRecord.userPrincipalName.toLowerCase() === currentItem.userPrincipalName.toLowerCase());
                    if (presenceDetailsOfCurrentItem !== undefined) {
                        currentItem.presence = presenceDetailsOfCurrentItem.availability;
                        currentItem.sortOrder = presenceDetailsOfCurrentItem.availabilitySortOrder;
                        currentItem.id = presenceDetailsOfCurrentItem.id;
                    }
                }
                return currentItem;
            });

            //Set the state for user presence in distribution list
            const distributionListMembers = this.state.distributionListMembers.map((currentItem) => {
                if (currentItem.userPrincipalName != null) {
                    let presenceDetailsOfCurrentItem = presenceDataList.find((currentPresenceRecord: IPresenceData) => currentPresenceRecord.userPrincipalName.toLowerCase() === currentItem.userPrincipalName.toLowerCase());
                    if (presenceDetailsOfCurrentItem !== undefined) {
                        currentItem.presence = presenceDetailsOfCurrentItem.availability;
                        currentItem.sortOrder = presenceDetailsOfCurrentItem.availabilitySortOrder;
                        currentItem.id = presenceDetailsOfCurrentItem.id;
                    }
                }
                return currentItem;
            });

            this.setState({
                masterDistributionListMembers: masterDistributionListMembers,
                distributionListMembers: distributionListMembers,
            })

            this.sortColumnItems("presence", true);
        });
    }

    // "Render Corresponding Presence Icon"
    private renderPresenceInfo = (presence: string) => {
        switch (presence) {
            case "None":
                return {
                    "icon": faCircle,
                    "color": "#D3D3D3",
                    "name": this.localize("presenceNone")
                };
            case "Away":
                return {
                    "icon": faClock,
                    "color": "#FDB913",
                    "name": this.localize("presenceAway")
                };
            case "Offline":
                return {
                    "icon": faCircle,
                    "color": "#D3D3D3",
                    "name": this.localize("presenceOffline")
                };
            case "DoNotDisturb":
                return {
                    "icon": faMinusCircle,
                    "color": "#C4314B",
                    "name": this.localize("presenceDoNotDisturb")
                };
            case "BeRightBack":
                return {
                    "icon": faClock,
                    "color": "#FDB913",
                    "name": this.localize("presenceBeRightBack")
                };

            case "Busy":
                return {
                    "icon": faCircle,
                    "color": "#C4314B",
                    "name": this.localize("presenceBusy")
                };
            case "Available":
                return {
                    "icon": faCheckCircle,
                    "color": "#92C353",
                    "name": this.localize("presenceOnline")
                };
            default:
                return {
                    "icon": faCircle,
                    "color": "#D3D3D3",
                    "name": this.localize("presenceOffline")
                };
        }

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
        let pinnedRecords = this.state.distributionListMembers.filter((e: IDistributionListMember) => e.isPinned === true);
        let unpinnedRecords = this.state.distributionListMembers.filter((e: IDistributionListMember) => e.isPinned === false);
        pinnedRecords = orderBy(pinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);
        unpinnedRecords = orderBy(unpinnedRecords, [sortColumn], sortOrder === true ? ["asc"] : ["desc"]);

        const distributionListMembers = pinnedRecords.concat(unpinnedRecords);
        this.setState({
            distributionListMembers: distributionListMembers
        })
    }

    //Used to reset the sorting on data load
    private resetSorting = (distributionListMembers: IDistributionListMember[]) => {
        let pinnedRecords = distributionListMembers.filter((e: IDistributionListMember) => e.isPinned === true);
        let unpinnedRecords = distributionListMembers.filter((e: IDistributionListMember) => e.isPinned === false);
        let sortColumn = this.state.sortedColumn;;

        pinnedRecords = orderBy(pinnedRecords, sortColumn, ["asc"]);
        unpinnedRecords = orderBy(unpinnedRecords, sortColumn, ["asc"]);
        distributionListMembers = pinnedRecords.concat(unpinnedRecords);

        this.setState({
            distributionListMembers: distributionListMembers,
            masterDistributionListMembers: distributionListMembers
        });
    }
    //#endregion "Sorting functions"

    //"Search function"
    private search = (e: React.SyntheticEvent<HTMLElement, Event>) => {
        let searchQuery = (e.target as HTMLInputElement).value;
        if (!searchQuery) {
            this.setState({
                distributionListMembers: this.state.masterDistributionListMembers,
            })
        }
        else {
            this.setState({
                distributionListMembers: this.state.masterDistributionListMembers.filter((member: IDistributionListMember) => member.displayName.toLowerCase().includes(searchQuery.toLowerCase())),
                activePage: 0,
            })
        }
    }

    // "Individual record checkbox selected"
    private checkboxChanged = (e: React.SyntheticEvent<HTMLElement, Event>, v?: CheckboxProps) => {
        let headerCheckValue = true;
        const selectedChkId = (e.currentTarget as Element).id;
        this.state.distributionListMembers.forEach((currentItem) => {
            if (currentItem.id === selectedChkId) {
                currentItem.isSelected = v!.checked ? v!.checked : false;
                if (currentItem.isSelected) {
                    this.checkedMembersForChat.push(currentItem);
                }
                else {
                    this.checkedMembersForChat.splice(this.checkedMembersForChat.findIndex(item => item.userPrincipalName === currentItem.userPrincipalName), 1);
                }
            }

            if (!currentItem.isSelected) {
                headerCheckValue = false;
            }
        });

        this.setState({
            isAllSelectChecked: headerCheckValue
        });
    }

    // "All Select Checkbox selected"
    private selectAllCheckboxChanged = (e: React.SyntheticEvent<HTMLElement, Event>, v?: CheckboxProps) => {
        const headerChkValue = v!.checked ? v!.checked : false;
        if (headerChkValue) {
            this.state.distributionListMembers.forEach((currentItem) => {
                if (!currentItem.isGroup) {
                    currentItem.isSelected = headerChkValue;
                    this.checkedMembersForChat.push(currentItem);
                }
            });
            this.setState({
                isAllSelectChecked: headerChkValue
            });
        }
        else {
            this.state.distributionListMembers.forEach((currentItem) => {
                currentItem.isSelected = headerChkValue;
            });
            this.checkedMembersForChat = [];
            this.setState({
                isAllSelectChecked: headerChkValue
            });
        }
    }

    //To update pin status
    private pinStatusUpdate = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const pinId = (e.target as Element).id;
        const member = (this.state.distributionListMembers.filter((dlmember: IDistributionListMember) => { return dlmember.id === pinId }));
        const pinStatus = !member[0].isPinned;

        //API call to update the database depending on whether the user pinned or not
        this.props.pinStatusUpdate(pinId, pinStatus, this.props.parentDlId).then((response: AxiosResponse<void>) => {
            this.state.distributionListMembers.forEach((dlmember: IDistributionListMember) => {
                if (pinId === dlmember.id) {
                    dlmember.isPinned = pinStatus;
                }
            });
            this.state.masterDistributionListMembers.forEach((dlmember: IDistributionListMember) => {
                if (pinId === dlmember.id) {
                    dlmember.isPinned = pinStatus;
                }
            });

            this.setState({
                distributionListMembers: this.state.distributionListMembers,
                masterDistributionListMembers: this.state.masterDistributionListMembers
            })
            this.resetSorting(this.state.distributionListMembers);
        });
    }

    //#region "Set Current Page for Pagination"
    private setActivePage = (newPageNumber: number) => {
        this.setState({
            activePage: newPageNumber,
        })
    }

    // "Helper for groupChat"
    private groupChatLink = () => {
        let userList = this.checkedMembersForChat.map(members => members.userPrincipalName).join(',');
        return userList;
    }

    // "groupChat from Chat for Nested DL"
    private groupChatWithMembers = () => {
        if (this.checkedMembersForChat.length > this.groupChatMembersLimit) {
            this.onOpenTaskModule();
        }
        else {
            const url = this.chatUrl + this.groupChatLink();
            microsoftTeams.executeDeepLink(encodeURI(url));
        }
    }

    //"1 on 1 Chat"
    private oneOnOneChat = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const url = this.chatUrl + encodeURI((e.target as Element).id);
        microsoftTeams.executeDeepLink(encodeURI(url));
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
    private setPageSize = (e: React.SyntheticEvent<HTMLElement, Event>, v?: DropdownProps) => {
        this.setState({
            pageSize: Number(v!.value),
            activePage: 0,
        });

        //Update database
        this.props.createUserPageSizeChoice({
            "PageId": this.pageId,
            "PageSize": v!.value
        }).then((response: AxiosResponse<void>) => {
            localStorage.setItem('localStorageDLMembersPageSizeValue', (v!.value || this.defaultPageSize).toString());
        })
    }

    //"Group chat task module"
    private onOpenTaskModule = () => {
        if (this.isOpenTaskModuleAllowed) {
            this.isOpenTaskModuleAllowed = false;
            const taskInfo: ITaskInfo = {
                url: getBaseUrl() + "/groupchatwarning/" + this.checkedMembersForChat.length,
                title: "",
                height: 300,
                width: 400,
                fallbackUrl: getBaseUrl() + "/groupchatwarning" + this.checkedMembersForChat.length
            }

            const submitHandler = (err: string, result: any) => {
                this.isOpenTaskModuleAllowed = true;
                if (result.response === this.taskModulePositiveResponseString) {
                    this.checkedMembersForChat = this.checkedMembersForChat.filter(item => item.presence === this.availabilityStatusOnline);
                    if (this.checkedMembersForChat.length > this.groupChatMembersLimit) {
                        this.checkedMembersForChat.splice(this.groupChatMembersLimit, this.checkedMembersForChat.length);
                    }
                    this.groupChatWithMembers();
                }
            };

            microsoftTeams.tasks.startTask(taskInfo, submitHandler);
        }
    }

    //"Render Method"
    public render(): JSX.Element {

        //Page size drop down values.
        let pageSize = [400];
        let pageNumber: number = this.state.activePage;
        let index = pageSize.indexOf(this.state.pageSize);
        let items = []; //Populate grid

        for (let j: number = pageNumber * this.state.pageSize; j < (pageNumber * this.state.pageSize) + this.state.pageSize; j++) {
            //#region Populate Grid
            if (j >= this.state.distributionListMembers.length) {
                break;
            }
            const distributionListMember = this.state.distributionListMembers[j];

            if (!distributionListMember.isGroup) {
                items.push(<Segment className="border-none" >
                    <Flex gap="gap.small">
                        <FlexItem>
                            <Checkbox key={distributionListMember.userPrincipalName} id={distributionListMember.id} label={distributionListMember.displayName} onClick={this.checkboxChanged} checked={distributionListMember.isSelected} disabled={distributionListMember.isGroup} />
                        </FlexItem>
                        <FlexItem>
                            <Icon iconName="Pinned" hidden={!distributionListMember.isPinned} className="disable-pin" />
                        </FlexItem>
                    </Flex>
                </Segment>);
            }
            else {
                items.push(<Segment className="border-none" >
                    <Flex gap="gap.small">
                        <FlexItem>
                            <Checkbox key={distributionListMember.userPrincipalName} id={distributionListMember.id} checked={distributionListMember.isSelected} disabled={distributionListMember.isGroup} className="group-checkbox dark-theme" />
                        </FlexItem>
                        <FlexItem>
                            <Text onClick={() => window.open("/dlmemberlist/" + distributionListMember.id + "/" + (this.props.parentDLName + " > " + distributionListMember.displayName), "_self")} content={distributionListMember.displayName} title={this.localize('viewDetails')} className="title dark-theme" />
                        </FlexItem>
                        <FlexItem>
                            <Icon iconName="Pinned" hidden={!distributionListMember.isPinned} className="disable-pin" />
                        </FlexItem>
                    </Flex>
                </Segment>);
            }
            items.push(<Segment className="border-none" content={distributionListMember.mail} ></Segment>);

            if (this.state.distributionListMembers[j].presence === this.notYetFetchedText) {
                items.push(<Segment className="border-none"><Loader size="smallest" /></Segment>)
            }
            else if (this.state.distributionListMembers[j].presence === "") {
                items.push(
                    <Segment className="border-none">
                        <Flex gap="gap.small">
                        </Flex>
                    </Segment>);
            }
            else {
                const userPresence = this.renderPresenceInfo(this.state.distributionListMembers[j].presence);
                items.push(
                    <Segment className="border-none">
                        <Flex gap="gap.small">
                            <FlexItem><FontAwesomeIcon className="presence-icon" icon={userPresence.icon} style={{ color: userPresence.color }} /></FlexItem>
                            <FlexItem><Text content={this.state.distributionListMembers[j].presence} /></FlexItem>
                        </Flex>
                    </Segment>);
            }

            if (distributionListMember.isGroup) {
                items.push(<Segment className="border-none">
                    <Flex gap="gap.small">
                        <Icon iconName={distributionListMember.isPinned ? "Unpin" : "Pinned"} className="seperator-spacing margin" id={distributionListMember.id} onClick={this.pinStatusUpdate}>
                        </Icon>
                    </Flex>
                </Segment>
                )
            }
            else {
                items.push(<Segment className="border-none actions-style">
                    <Flex gap="gap.small" className="action-section">
                        <Icon iconName="Chat" title="Chat" id={distributionListMember.userPrincipalName} onClick={this.oneOnOneChat} className="title-sort-icon">
                        </Icon>
                        <Icon iconName={distributionListMember.isPinned ? "Unpin" : "Pinned"} title={distributionListMember.isPinned ? "Unpin" : "Pin"} className="seperator-spacing" id={distributionListMember.id} onClick={this.pinStatusUpdate}>
                        </Icon>
                    </Flex>
                </Segment>)
            }
        }

        let segmentRows = []; //Populate grid
        if (this.state.loader) {
            segmentRows.push(<Segment styles={{ gridColumn: 'span 5', }}>< Loader /></Segment >);
        }
        else {
            segmentRows.push(items);
        }

        let navigation = [];
        if (this.props.parentDLName) {

            const groups = this.props.parentDLName.split('>');
            const historyJson = localStorage.getItem("localStorageHistory");
            if (historyJson != null) {
                this.historyArray = JSON.parse(historyJson);
            }
            navigation.push(<Text onClick={() => window.open(this.historyArray[0], "_self")} className="nav-header">{this.localize("distributionListsTitle")}</Text>);
            for (let i = 0; i < groups.length; i++) {
                navigation.push(<Text content=" > " className="nav-header-arrow" />);
                if (i < groups.length - 1)
                    navigation.push(<Text onClick={() => window.open(this.historyArray[i + 1], "_self")} className="nav-header">{groups[i]}</Text>);
                else
                    navigation.push(<Text content={groups[i]} className="nav-header-text" />);
            }
        }

        return (
            <div className="main-component">
                <div className={"form-container"}>
                    <Flex space="between">
                        <Flex>
                            {navigation}
                        </Flex>
                        <Flex gap="gap.small">
                            {/*<div className="div-style">
                                <Dropdown
                                    className="bg-color"
                                    fluid={true}
                                    items={pageSize}
                                   
                                    highlightedIndex={index}
                                    
                                    checkable
                                />
                            </div>*/}
                            <FlexItem>
                                <Input icon="search" className="search-box" placeholder={this.localize("search")} onChange={this.search} />
                            </FlexItem>
                            <FlexItem>
                                <Button content={this.localize("startGroupChat")} disabled={!(this.checkedMembersForChat.length > 1)} primary onClick={this.groupChatWithMembers} />
                            </FlexItem>
                        </Flex>
                    </Flex>
                    <br />
                    <div className="form-content-container" >
                        <Grid columns="1.5fr 2fr 1.5fr 1fr">
                            <Segment color="brand" className="header">
                                <Flex className="dark-theme" gap="gap.small">
                                    <FlexItem>
                                        <Checkbox className="dark-theme margin-style" key="contactName" id="contactName" label={this.localize("headerContactName")} onClick={this.selectAllCheckboxChanged} checked={this.state.isAllSelectChecked} />
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon className="dark-theme margin-style" iconName={this.state.sortedColumn == "displayName" ? this.state.sortDirection : ""}>
                                        </Icon>
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon iconName="ChevronDown" id="displayName" key="displayName" className="title-sort-icon" onClick={() => this.sortDataByColumn("displayName")}>
                                        </Icon>
                                    </FlexItem>
                                </Flex>
                            </Segment>

                            <Segment color="brand" className="header">
                                <Flex gap="gap.small">
                                    <FlexItem>
                                        <Text className="dark-theme margin-style" content={this.localize("headerContactAlias")} />
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon className="dark-theme margin-style" iconName={this.state.sortedColumn == "mail" ? this.state.sortDirection : ""}>
                                        </Icon>
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon iconName="ChevronDown" id="mail" key="mail" className="title-sort-icon dark-theme" onClick={() => this.sortDataByColumn("mail")}>
                                        </Icon>
                                    </FlexItem >
                                </Flex>
                            </Segment>

                            <Segment color="brand" className="header">
                                <Flex gap="gap.small">
                                    <FlexItem>
                                        <Text className="dark-theme margin-style" content={this.localize("headerPresenceStatus")} />
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon className="dark-theme margin-style" iconName={this.state.sortedColumn == "presence" ? this.state.sortDirection : ""}>
                                        </Icon>
                                    </FlexItem>
                                    <FlexItem>
                                        <Icon iconName="ChevronDown" id="presence" key="presence" className="title-sort-icon dark-theme" onClick={() => this.sortDataByColumn("presence")}>
                                        </Icon>
                                    </FlexItem >
                                </Flex>
                            </Segment>

                            <Segment color="brand" content="Name" className="header">
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
                            <Pagination callbackFromParent={this.setActivePage} entitiesLength={this.state.distributionListMembers.length} activePage={this.state.activePage} numberOfContents={this.state.pageSize}></Pagination>
                        </Flex>
                    </Segment>
                </div>
            </div>

        );
    }
}
export default withTranslation()(DistributionListMembers) 