import { IInputs, IOutputs } from "./generated/ManifestTypes";
import ReactDOM = require("react-dom");
import React = require("react");
import { IDurationPickerProps, DurationPicker } from "./DurationPicker";
import { isNullOrUndefined } from "util";

export class DuractionPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _input: number;
	private _inputElement: React.ReactElement;
	private notifyOutputChanged: () => void;
	private _context: ComponentFramework.Context<IInputs>;

	private props: IDurationPickerProps = {
		context: this._context,
		onDurationChange: this.handleDurationUpdate.bind(this),
		inputValue: this._input ? this._input : 0
	}

	/**
	 * Empty constructor.
	 */
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
		this._container = container;
		this.notifyOutputChanged = notifyOutputChanged;

		if (!isNullOrUndefined(context.parameters.duration) && !isNullOrUndefined(context.parameters.duration.raw)) {
			this._input = context.parameters.duration.raw || 0;
			this.props.inputValue = this._input ? this._input : 0;

		}

		this.renderControl(context);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this._context = context;

		if (this._input != context.parameters.duration.raw || (isNullOrUndefined(this._input) && !isNullOrUndefined(context.parameters.duration.raw))) {
			this._input = context.parameters.duration.raw || 0;
		}

		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {
		ReactDOM.render(this._inputElement = React.createElement(DurationPicker, this.props), this._container);
	}

	private handleDurationUpdate(value: number) {
		this.props.inputValue = value;
		this._input = value;
		this.notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return { duration: this._input };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this._container);
	}
}