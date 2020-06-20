// <copyright file="pagination.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { List, FlexItem } from '@stardust-ui/react';
import { initializeIcons } from '@uifabric/icons';

export interface IPaginationProps {
    callbackFromParent: (newPageNumber: number) => void;
    entitiesLength: number;
    activePage: number;
    numberOfContents: number;
}

class Pagination extends React.Component<IPaginationProps, {}> {

    constructor(props: any) {
        super(props);
        initializeIcons();
    };

    public render(): JSX.Element {
        const numberOfPages = Math.ceil(this.props.entitiesLength / this.props.numberOfContents);//Total Page count

        //#region Populate paging List
        let pagingItems = []
        pagingItems.push({
            key: "<",
            header: "<",
        });

        for (let k = 0; k < numberOfPages; k++) {
            pagingItems.push({
                key: k,
                header: k + 1,
            });
        }
        pagingItems.push({
            key: ">",
            header: ">",
        });
        //#endregion

        return (

            <FlexItem push>
                <List defaultSelectedIndex={1} selectable items={pagingItems} horizontal
                    selectedIndex={this.props.activePage + 1}
                    onSelectedIndexChange={(e, newProps) => {

                        //#region "Handle Paging clicks"
                        let seletedValue = this.props.activePage;
                        if (newProps !== undefined && newProps.selectedIndex !== undefined) {

                            if (newProps.selectedIndex > numberOfPages && this.props.activePage !== numberOfPages - 1)//If > is clicked
                            {
                                seletedValue = this.props.activePage + 1;
                                newProps.selectedIndex = seletedValue;

                                this.props.callbackFromParent(seletedValue);
                            }
                            else if (newProps.selectedIndex <= numberOfPages) //If < is clicked
                            {
                                if (newProps.selectedIndex !== 0 || this.props.activePage !== 0) {
                                    if (newProps.selectedIndex === 0) {
                                        seletedValue = this.props.activePage - 1;
                                        newProps.selectedIndex = seletedValue;
                                    }
                                    else
                                        seletedValue = newProps.selectedIndex - 1;

                                    this.props.callbackFromParent(seletedValue);
                                }
                            }
                        }
                        //#endregion "Handle Paging clicks"

                    }}
                />
            </FlexItem>
        );
    }
}

export default Pagination;