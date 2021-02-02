import * as React from "react";
import { Fabric, DetailsList, Selection, IColumn, MarqueeSelection, DetailsListLayoutMode, TextField } from "@fluentui/react"
import { IInputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

const controlStyles = {
  root: {
    margin: '0 30px 20px 0',
    maxWidth: '300px',
  },
};

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

    this._allItems = props.records;

    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
    };
  }

  private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string | undefined): void => {
    this.setState({
      items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems,
    });
  };

  render() {
    const { items, selectionDetails } = this.state;
    return (
      <Fabric>
        <TextField label="Filter by name:" onChange={this._onChangeText} styles={controlStyles} />
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