import * as React from 'react';
import { TextField, IStackStyles, Stack, IStackTokens, ITextFieldStyles, Text, IconButton, IButtonStyles } from '@fluentui/react';
import { IInputs } from "./generated/ManifestTypes";
import { initializeIcons } from '@uifabric/icons';
initializeIcons();

import { Icon } from '@fluentui/react/lib/Icon';

const buttonStyle: IButtonStyles = {
  root: {
    width: 50
  },
};

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
  interval: any
}

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
    { width: 50 },
    { border: "none" }
  ],
  field: { textAlign: "center" }
};

export class DurationPicker extends React.Component<IDurationPickerProps, IDurationPickerState> {
  private maxMin: number = 60;
  private maxHour: number = 24;
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
    this.startContinuousDecrement = this.startContinuousDecrement.bind(this);
    this.stopContinuousDecrement = this.stopContinuousDecrement.bind(this);
    this.liftDurationChange = this.liftDurationChange.bind(this);
  }

  private convertMinutes(minutes: number) {
    var num = minutes;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return { hours: rhours, minutes: rminutes }
  }

  private startContinuousIncrement(target: string) {
    this.increment(target);
    let myInterval = setInterval(() => this.increment(target), 250)
    this.setState({ interval: myInterval });
  }

  private stopContinuousIncrement(event: any) {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  private increment(target: string) {
    switch (target) {
      case "minutes":
        if (this.state.hours < this.maxHour) {
          if (this.state.minutes < this.maxMin - this.state.incrementMinValue) {
            this.setMinutes(this.state.minutes + this.state.incrementMinValue);
          } else {
            this.setMinutes(0);
            this.setHours(this.state.hours + 1);
          }
        }
        break;
      case "hours":
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

  private startContinuousDecrement(target: string) {
    this.decrement(target);
    let myInterval = setInterval(() => this.decrement(target), 250)
    this.setState({ interval: myInterval });
  }

  private stopContinuousDecrement(event: any) {
    clearInterval(this.state.interval);
    this.setState({ interval: null });
  }

  private decrement(target: string) {
    switch (target) {
      case "minutes":
        if (this.state.minutes > 0) {
          this.setMinutes(this.state.minutes - this.state.incrementMinValue);
        } else if (this.state.hours > 0) {
          this.setMinutes(45);
          this.setHours(this.state.hours - 1);
        }
        break;
      case "hours":
        if (this.state.hours > 0)
          this.setHours(this.state.hours - this.state.incrementHrsValue);
        break;
    }
  }

  private setMinutes(value: number) {
    this.setState({ minutes: value }, this.liftDurationChange);
  }

  private setHours(value: number) {
    this.setState({ hours: value }, this.liftDurationChange);
  }

  private liftDurationChange() {
    this.props.onDurationChange(this.state.hours * 60 + this.state.minutes);
  }

  render() {
    return (
      <Stack horizontal styles={stackStyles} disableShrink tokens={numericalSpacingStackTokens}>
        <Stack styles={stackStyles}>
          <IconButton title="ChevronUpSmall" id="hours" iconProps={{ iconName: "ChevronUpSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousIncrement("hours") }} onMouseUp={() => this.stopContinuousIncrement("hours")} onMouseOut={() => this.stopContinuousDecrement("hours")} />
          <TextField styles={narrowTextFieldStyles} value={this.state.hours.toString()} readOnly />
          <IconButton id="hours" iconProps={{ iconName: "ChevronDownSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousDecrement("hours") }} onMouseUp={() => this.stopContinuousDecrement("hours")} onMouseOut={() => this.stopContinuousDecrement("hours")} />
          <Text> HRS </Text>
        </Stack>
        <Stack styles={stackStyles}>
          <IconButton title="ChevronUpSmall" id="minutes" iconProps={{ iconName: "ChevronUpSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousIncrement("minutes") }} onMouseUp={() => this.stopContinuousIncrement("minutes")} onMouseOut={() => this.stopContinuousDecrement("minutes")} />
          <TextField styles={narrowTextFieldStyles} value={this.state.minutes.toString()} readOnly />
          <IconButton id="minutes" iconProps={{ iconName: "ChevronDownSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousDecrement("minutes") }} onMouseUp={() => this.stopContinuousDecrement("minutes")} onMouseOut={() => this.stopContinuousDecrement("minutes")} />
          <Text> MIN </Text>
        </Stack>
      </Stack>
    )
  }
}