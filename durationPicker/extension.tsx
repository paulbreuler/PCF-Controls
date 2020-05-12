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

const textFieldStyle: ITextFieldStyles = {
  root: {},
  fieldGroup: {},
  prefix: {},
  suffix: {},
  field: { textAlign: "right" },
  icon: {},
  description: {},
  wrapper: {},
  errorMessage: {},
  subComponentStyles: { label: {} }
}

export interface IDurationPickerProps {
  context: ComponentFramework.Context<IInputs>;
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

const narrowTextFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 50 } };

export class DurationPicker extends React.Component<IDurationPickerProps, IDurationPickerState> {
  private maxMin: number = 60;
  private maxHour: number = 24;
  constructor(props: IDurationPickerProps) {
    super(props);
    this.state = {
      minutes: 0,
      hours: 0,
      incrementMinValue: 15,
      incrementHrsValue: 1,
      interval: null
    }

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.startContinuousDecrement = this.startContinuousDecrement.bind(this);
    this.stopContinuousDecrement = this.stopContinuousDecrement.bind(this);
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
        if (this.state.minutes < this.maxMin - this.state.incrementMinValue) {
          this.setState({ minutes: this.state.minutes + this.state.incrementMinValue });
        } else {
          this.setState({ minutes: 0 });
          this.setState({ hours: this.state.hours + 1 });
        }
        break;
      case "hours":
        if (this.state.hours < this.maxHour)
          this.setState({ hours: this.state.hours + this.state.incrementHrsValue });
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
          this.setState({ minutes: this.state.minutes - this.state.incrementMinValue });
        } else if (this.state.hours > 0) {
          this.setState({ minutes: 45 });
          this.setState({ hours: this.state.hours - 1 });
        }
        break;
      case "hours":
        if (this.state.hours > 0)
          this.setState({ hours: this.state.hours - this.state.incrementHrsValue });
        break;
    }
  }

  render() {
    return (
      <Stack horizontal styles={stackStyles} disableShrink tokens={numericalSpacingStackTokens}>
        <Stack styles={stackStyles}>
          <IconButton title="ChevronUpSmall" id="hours" iconProps={{ iconName: "ChevronUpSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousIncrement("hours") }} onMouseUp={() => this.stopContinuousIncrement("hours")} />
          <TextField styles={narrowTextFieldStyles} value={this.state.hours.toString()} />
          <IconButton id="hours" iconProps={{ iconName: "ChevronDownSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousDecrement("hours") }} onMouseUp={() => this.stopContinuousDecrement("hours")} />
          <Text> HRS </Text>
        </Stack>
        <Stack styles={stackStyles}>
          <IconButton title="ChevronUpSmall" id="minutes" iconProps={{ iconName: "ChevronUpSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousIncrement("minutes") }} onMouseUp={() => this.stopContinuousIncrement("minutes")} />
          <TextField styles={narrowTextFieldStyles} value={this.state.minutes.toString()} />
          <IconButton id="minutes" iconProps={{ iconName: "ChevronDownSmall" }} styles={buttonStyle} onMouseDown={() => { this.startContinuousDecrement("minutes") }} onMouseUp={() => this.stopContinuousDecrement("minutes")} />
          <Text> MIN </Text>
        </Stack>
      </Stack>
    )
  }
}