import * as React from "react";
import { Fabric, DetailsList, Selection, IColumn, MarqueeSelection, DetailsListLayoutMode, ColumnActionsMode } from "@fluentui/react"
import { IInputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IDetailsListExampelProps {
  columns: IColumn[],
  records: any[]
}

export interface IDetailsListExampleItem {
  key: number;
  name: string;
  value: any;
}

export interface IDetailsListExampleState {
  items: IDetailsListExampleItem[];
  selectionDetails: string;
}

export class DetailsListExample extends React.Component<IDetailsListExampelProps, IDetailsListExampleState> {
  private _selection: Selection;
  private _allItems: IDetailsListExampleItem[];
  private _columns: IColumn[];

  constructor(props: IDetailsListExampelProps) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });


    this.state = {
      items: props.records,
      selectionDetails: this._getSelectionDetails(),
    };
  }

  render() {
    const { items, selectionDetails } = this.state;
    return (
      <Fabric>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={this.props.columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
            onItemInvoked={this._onItemInvoked}
          />
        </MarqueeSelection>
      </Fabric>
    )
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListExampleItem).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onItemInvoked = (item: IDetailsListExampleItem): void => {
    alert(`Item invoked: ${item.name}`);
  };

}