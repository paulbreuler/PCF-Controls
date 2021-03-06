import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ReactDOM = require("react-dom");
import React = require("react");
import { DetailsListExample, IDetailsListExampelProps } from "./DetailsList";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import { IColumn } from "@fluentui/react";
type DataSet = ComponentFramework.PropertyTypes.DataSet;

interface ISimplifiedDataSet {
	simplifiedColumns: IColumn[],
	simplifiedRecords: any[]
}

export class DetailsList implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _input: number = 0;
	private _inputElement: React.ReactElement;
	private notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;
	private _state: ComponentFramework.Dictionary;

	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._context = context;
		this.notifyOutputChanged = notifyOutputChanged;
		this._state = state;
		this._container = container;
	}

	private simplifyDataSet(context: ComponentFramework.Context<IInputs>): ISimplifiedDataSet {
		let simplifiedColumns: IColumn[] = [];
		let simplifiedRecords: any[] = [];

		context.parameters.dataSet.columns.forEach((column: DataSetInterfaces.Column) => {
			simplifiedColumns.push({
				key: column.name,
				name: column.displayName,
				fieldName: column.name,
				minWidth: 100,
				maxWidth: 200,
				isCollapsible: true,
				isCollapsable: true,
				isGrouped: false,
				isMultiline: false,
				isResizable: true,
				isRowHeader: false,
				isSorted: false,
				isSortedDescending: false,
				columnActionsMode: 1
			})
		});

		context.parameters.dataSet.sortedRecordIds.forEach((recordId) => {
			debugger;
			let currentRecord = context.parameters.dataSet.records[recordId];
			let rec: any = {};
			
			rec["recordId"] = currentRecord.getRecordId();

			simplifiedColumns.forEach((column: IColumn) => {
				rec[column.key] = currentRecord.getFormattedValue(column.fieldName as string);
			})
			simplifiedRecords.push(rec);
		})

		return { simplifiedColumns, simplifiedRecords };
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;
		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {

		let result: ISimplifiedDataSet = this.simplifyDataSet(context);
		let props: IDetailsListExampelProps = {
			columns: result.simplifiedColumns,
			records: result.simplifiedRecords
		}
		ReactDOM.render(this._inputElement = React.createElement(DetailsListExample, props), this._container);
	}
	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

}