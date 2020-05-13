import * as React from 'react';
import { TextField, IStackStyles, Stack, IStackTokens, ITextFieldStyles, Text, IconButton, IButtonStyles, BaseButton, Button, Label, VirtualizedComboBox } from '@fluentui/react';
import { IInputs } from "./generated/ManifestTypes";
import { initializeIcons } from '@uifabric/icons';
import { isNullOrUndefined } from 'util';
initializeIcons();

//#region  Interfaces
export interface IDurationPickerProps {
  context: ComponentFramework.Context<IInputs>;
  onDurationChange: any,
  inputValue: number
}

export interface IDurationPickerState {
  minutes: number;
  hours: number;
  incrementMinValue: number;
  incrementHrsValue: number;
  interval: any,
  isLongPress: boolean,
  longPressStartTime: Date | null,
}

interface ITime {
  hours: number;
  minutes: number;
}
//#region 

//#region styles
const buttonStyle: IButtonStyles = {
  root: {
    width: 35
  },
};

const stackStyles: IStackStyles = {
  root: {
  },
};

const centerStackStyles: IStackStyles = {
  root: {
    fontSize: 20,
    fontWeight: "400",
    marginTop: 32,
  },
};

const numericalSpacingStackTokens: IStackTokens = {
  childrenGap: 10,
  padding: 10,
};

const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: [
    {
      width: 35
    },

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
  private mouseDownDelay: number = 250;
  private isKeyDownDelay: boolean = false;
  private mouseHoldVarianceDelay: number = 500;

  constructor(props: IDurationPickerProps) {
    super(props);
    let duration = this.convertMinutes(this.props.inputValue);
    this.state = {
      minutes: duration.minutes,
      hours: duration.hours,
      incrementMinValue: 15,
      incrementHrsValue: 1,
      interval: null,
      isLongPress: false,
      longPressStartTime: null
    }

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.setMinutes = this.setMinutes.bind(this);
    this.setHours = this.setHours.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.startContinuousDecrement = this.startContinuousDecrement.bind(this);
    this.stopContinuousDecrement = this.stopContinuousDecrement.bind(this);
    this.liftDurationChange = this.liftDurationChange.bind(this);
    this.setHoursText = this.setHoursText.bind(this);
    this.setMinutesText = this.setMinutesText.bind(this);
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

    if (!this.state.isLongPress) {
      this.setState({ longPressStartTime: new Date(), isLongPress: true })
    }

    let myInterval = setInterval(() => this.increment(target), this.mouseDownDelay)
    this.setState({ interval: myInterval });
  }

  private stopContinuousIncrement(): void {
    clearInterval(this.state.interval);
    this.setState({ isLongPress: false, longPressStartTime: null });
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

          if (!isNullOrUndefined(this.state.longPressStartTime) && (new Date().getTime() - (this.state.longPressStartTime as Date).getTime()) > this.mouseHoldVarianceDelay && this.state.minutes % 5 === 0) {
            incrementValue = 5;
          }

          if (this.state.minutes + incrementValue < this.maxMin) {

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

    if (!this.state.isLongPress) {
      this.setState({ longPressStartTime: new Date(), isLongPress: true })
    }

    let myInterval = setInterval(() => this.decrement(target), this.mouseDownDelay)
    this.setState({ interval: myInterval });
  }

  private stopContinuousDecrement(): void {
    clearInterval(this.state.interval);
    this.setState({ isLongPress: false, longPressStartTime: null });
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
        if (!isNullOrUndefined(this.state.longPressStartTime) && (new Date().getTime() - (this.state.longPressStartTime as Date).getTime()) > this.mouseHoldVarianceDelay && this.state.minutes % 5 === 0) {
          decrementValue = 5;
        }

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
  private onKeyDown(event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | Button | HTMLSpanElement>, type: string, target: string): void {
    if ([32, 13].includes(event.keyCode)) {

      if (this.isKeyDownDelay) return;

      this.isKeyDownDelay = true;
      let _this = this;

      if (!this.state.isLongPress) {
        this.setState({ longPressStartTime: new Date(), isLongPress: true })
      }

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

  private onKeyUp(event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton | Button | HTMLSpanElement>) {
    if ([32, 13].includes(event.keyCode)) {
      this.setState({ isLongPress: false, longPressStartTime: null });
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

        this.setHours(parsedValue);
        break;
      case Time.Minutes:

        if (parsedValue > this.maxMin)
          parsedValue = this.maxMin

        if (this.state.hours === this.maxHour)
          parsedValue = 0

        this.setMinutes(parsedValue);
        break;
    }
  }

  private setHoursText(): string {
    let hours = this.state.hours < 10 && this.state.hours > 0 ? `0${this.state.hours.toString()}` : this.state.hours <= 0 ? "" : this.state.hours.toString()
    return hours
  }

  private setMinutesText(): string {
    let minutes: string = ''

    if (this.state.minutes < 10 && this.state.minutes > 0) {
      minutes = `0${this.state.minutes.toString()}`;
    } else if (this.state.minutes <= 0 && this.state.hours > 0) {
      minutes = `0${this.state.minutes.toString()}`;
    } else if (this.state.minutes <= 0) {
      minutes = ""
    } else {
      minutes = this.state.minutes.toString()
    }

    return minutes
  }

  render() {
    return (
      <Stack horizontal styles={stackStyles} disableShrink tokens={numericalSpacingStackTokens}>
        <Stack styles={stackStyles}>
          <IconButton id={Time.Hours} iconProps={{ iconName: upIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousIncrement(Time.Hours)}
            onMouseUp={() => this.stopContinuousIncrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.onKeyDown(e, increment, Time.Hours)}
            onKeyUp={this.onKeyUp} />
          <TextField styles={narrowTextFieldStyles} value={this.setHoursText()}
            onChange={(e: any) => this.onTextChange(e, Time.Hours)} borderless placeholder="--" />
          <IconButton id={Time.Hours} iconProps={{ iconName: downIcon }} styles={buttonStyle}
            onMouseDown={() => { this.startContinuousDecrement(Time.Hours) }}
            onMouseUp={() => this.stopContinuousDecrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.onKeyDown(e, decrement, Time.Hours)}
            onKeyUp={this.onKeyUp} />
          <Text> HRS </Text>
        </Stack>
        <Stack horizontalAlign="center" styles={centerStackStyles}>
          <span>:</span>
        </Stack>
        <Stack styles={stackStyles}>
          <IconButton id={Time.Minutes} iconProps={{ iconName: upIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousIncrement(Time.Minutes)}
            onMouseUp={() => this.stopContinuousIncrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.onKeyDown(e, increment, Time.Minutes)}
            onKeyUp={this.onKeyUp} />
          <TextField styles={narrowTextFieldStyles} value={this.setMinutesText()}
            onChange={(e: any) => this.onTextChange(e, Time.Minutes)} borderless placeholder="--" />
          <IconButton id={Time.Minutes} iconProps={{ iconName: downIcon }} styles={buttonStyle}
            onMouseDown={() => this.startContinuousDecrement(Time.Minutes)}
            onMouseUp={() => this.stopContinuousDecrement()}
            onMouseOut={() => this.stopContinuousDecrement()}
            onKeyDown={(e) => this.onKeyDown(e, decrement, Time.Minutes)}
            onKeyUp={this.onKeyUp} />
          <Text> MIN </Text>
        </Stack>
      </Stack>
    )
  }
}