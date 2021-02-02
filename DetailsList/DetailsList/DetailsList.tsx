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
  recordId: string,
  [x: string]: any
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
    let filteredSet = this._allItems.filter(i => JSON.stringify(i).toLowerCase().indexOf((text as string).toLowerCase()) > -1)
    this.setState({
      items: text ? filteredSet : this._allItems,
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
            onItemInvoked={(item) => this._onItemInvoked(item)}
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

  private async _onItemInvoked(item: IDetailsListExampleItem) {
    debugger;
    var entityFormOptions: any = {};
    entityFormOptions["entityName"] = "contact";
    entityFormOptions["entityId"] = item.recordId;

    try {
      let response = await Xrm.Navigation.openForm(entityFormOptions);
    } catch (error) {
      console.debug(error);
    }

  };

}