import * as React from 'react';
import { TextField, IStackStyles, Stack, IStackTokens, ITextFieldStyles, Text, IconButton, IButtonStyles, BaseButton, Button } from '@fluentui/react';
import { IInputs } from "./generated/ManifestTypes";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

//#region  Interfaces
export interface IDurationPickerProps {
  context: ComponentFramework.Context<IInputs>;
  onDurationChange: any,
  inputValue: number,
  allowSteppedVariation?: boolean
}

export interface IDurationPickerState {
  minutes: number;
  hours: number;
  incrementMinValue: number;
  incrementHrsValue: number;
  interval: any
}

interface ITime {
  hours: number;
  minutes: number;
}
//#region 

//#region styles
const buttonStyle: IButtonStyles = {
  root: {
    width: 50
  },
};

const stackStyles: IStackStyles = {
  root: {
  },
};

const numericalSpacingStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: [
    { width: 50 }
  ],
  field: { textAlign: "center" }
};
//#endregion

enum Time {
  Hours = "hours",
  Minutes = "minutes"
}

const increment = "increment";
const decrement = "decrement";
const upIcon = "ChevronUpSmall";
const downIcon = "ChevronDownSmall";

export class DurationPicker extends React.Component<IDurationPickerProps, IDurationPickerState> {
  private maxMin: number = 60;
  private maxHour: number = 24;
  private keyDownDelay: number = 100;
  private isKeyDownDelay: boolean = false;

  constructor(props: IDurationPickerProps) {
    super(props);
    let duration = this.convertMinutes(this.props.inputValue);
    this.state = {
      minutes: duration.minutes,
      hours: duration.hours,
      incrementMinValue: 15,
      incrementHrsValue: 1,
      interval: null
    }

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.setMinutes = this.setMinutes.bind(this);
    this.setHours = this.setHours.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startContinuousDecrement = this.startContinuousDecrement.bind(this);
    this.stopContinuousDecrement = this.stopContinuousDecrement.bind(this);
    this.liftDurationChange = this.liftDurationChange.bind(this);
  }

  /**
   * Converts minutes to object containing hours and minutes
   * @param {number} minutes 
   * @returns {ITime} ITime object representing hours and minutes of total time
   */
  private convertMinutes(minutes: number): ITime {
    var num = minutes;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return { hours: rhours, minutes: rminutes }
  }

  /**
   * @param target "hours" or "minutes" as string
   */
  private startContinuousIncrement(target: string): void {
    this.increment(target);
    let myInterval = setInterval(() => this.increment(target), 250)
    this.setState({ interval: myInterval });
  }

  private stopContinuousIncrement(): void {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  /**
   * @param target "hours" or "minutes" as string
   */
  private increment(target: string): void {
    switch (target) {
      case Time.Minutes:
        if (this.state.hours < this.maxHour) {

          let incrementValue: number = 1;
          if (this.props.allowSteppedVariation)
            incrementValue = this.state.minutes % 15 === 0 ? 15 : this.state.minutes % 5 === 0 ? 5 : 1;

          if (this.state.minutes < this.maxMin) {

            this.setMinutes(this.state.minutes + incrementValue);
          } else {
            this.setMinutes(0);
            this.setHours(this.state.hours + 1);
          }
        }
        break;
      case Time.Hours:
        if (this.state.hours < this.maxHour) {
          let newValue = this.state.hours + this.state.incrementHrsValue;
          this.setHours(newValue);
          if (newValue === this.maxHour) {
            this.setMinutes(0);
          }
        } else {
          this.setMinutes(0);
        }
        break;
    }
  }

  /**
  * @param target "hours" or "minutes" as string
  */
  private startContinuousDecrement(target: string): void {
    this.decrement(target);
    let myInterval = setInterval(() => this.decrement(target), 250)
    this.setState({ interval: myInterval });
  }

  private stopContinuousDecrement(): void {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  /**
   * Decrement by 1, 5, or 15 on current value
   * @param target "hours" or "minutes" as string
   */
  private decrement(target: string): void {
    switch (target) {
      case Time.Minutes:

        let decrementValue: number = 1
        if (this.props.allowSteppedVariation)
          decrementValue = this.state.minutes % 15 === 0 ? 15 : this.state.minutes % 5 === 0 ? 5 : 1;

        if (this.state.minutes > 0) {
          this.setMinutes(this.state.minutes - decrementValue);
        } else if (this.state.hours > 0) {
          this.setMinutes(60 - decrementValue);
          this.setHours(this.state.hours - 1);
        }
        break;
      case Time.Hours:
        if (this.state.hours > 0)
          this.setHours(this.state.hours - this.state.incrementHrsValue);
        break;
    }
  }

  private setMinutes(value: number): void {
    this.setState({ minutes: value }, this.liftDurationChange);
  }

  private setHours(value: number): void {
    this.setState({ hours: value }, this.liftDurationChange);
  }

  /**
   * 
   * @param event 
   * @param type "increment" or "decrement" as string
   * @param target "hours" or "minutes" as string
   */
  private handleKeyPress(event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | Button | HTMLSpanElement>, type: string, target: string): void {
    if (event.keyCode === 32 || event.keyCode === 13) {
      if (this.isKeyDownDelay) return;
      this.isKeyDownDelay = true;
      let _this = this;
      setTimeout(function () { _this.isKeyDownDelay = false; }, this.keyDownDelay);
      switch (type) {
        case increment:
          this.increment(target);
          break;
        case decrement:
          this.decrement(target);
          break;
      }
    }
  }

  /**
   * Pass input value to parent componenr
   */
  private liftDurationChange(): void {
    this.props.onDurationChange(this.state.hours * 60 + this.state.minutes);
  }

  /**
   * Handle manual input in text field
   * @param event 
   * @param target "hours" or "minutes" as string
   */
  private onTextChange(event: any, target: string): void {
    let parsedValue: number = 0;

    // Empty string is non NaN
    // Allow invalid input if first character is a number (Ignore invalid chars)
    if (event.target.value && !isNaN(event.target.value.charAt(0))) {
      parsedValue = parseInt(event.target.value);
    }

    switch (target) {
      case Time.Hours:
        if (parsedValue > this.maxHour)
          parsedValue = this.maxHour;
        this.setState({ hours: parsedValue }, this.liftDurationChange)
        break;
      case Time.Minutes:
        if (parsedValue > this.maxMin)
          parsedValue = this.maxMin
        this.setState({ minutes: parsedValue }, this.liftDurationChange)
        break;
    }
  }

  render() {
    return (
      <Stack horizontal styles={stackStyles} disableShrink tokens={numericalSpacingStackTokens}>
        <Stack styles={stackStyles}>
          <IconButton title={upIcon} id={Time.Hours} iconProps={{ iconName: upIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousIncrement(Time.Hours)}
            onMouseUp={() => this.stopContinuousIncrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.handleKeyPress(e, increment, Time.Hours)} />
          <TextField styles={narrowTextFieldStyles} value={this.state.hours.toString()}
            onChange={(e: any) => this.onTextChange(e, Time.Hours)} borderless />
          <IconButton title={downIcon} id={Time.Hours} iconProps={{ iconName: downIcon }} styles={buttonStyle}
            onMouseDown={() => { this.startContinuousDecrement(Time.Hours) }}
            onMouseUp={() => this.stopContinuousDecrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.handleKeyPress(e, decrement, Time.Hours)} />
          <Text> HRS </Text>
        </Stack>
        <Stack styles={stackStyles}>
          <IconButton title={upIcon} id={Time.Minutes} iconProps={{ iconName: upIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousIncrement(Time.Minutes)}
            onMouseUp={() => this.stopContinuousIncrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.handleKeyPress(e, increment, Time.Minutes)} />
          <TextField styles={narrowTextFieldStyles} value={this.state.minutes.toString()}
            onChange={(e: any) => this.onTextChange(e, Time.Minutes)} borderless />
          <IconButton title={downIcon} id={Time.Minutes} iconProps={{ iconName: downIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousDecrement(Time.Minutes)}
            onMouseUp={() => this.stopContinuousDecrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.handleKeyPress(e, decrement, Time.Minutes)} />
          <Text> MIN </Text>
        </Stack>
      </Stack>
    )
  }
}