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

export interface IButtonProps {
  context: ComponentFramework.Context<IInputs>;
}

export interface IButtonState {
  minutes: number;
  hours: number;
  incrementMinValue: number;
  incrementHrsValue: number;
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

export class CustomButton extends React.Component<IButtonProps, IButtonState> {
  private maxMin: number = 60;
  private maxHour: number = 24;
  constructor(props: IButtonProps) {
    super(props);
    this.state = {
      minutes: 0,
      hours: 0,
      incrementMinValue: 15,
      incrementHrsValue: 1
    }

    this.increment = this.increment.bind(this);
  }

  private increment(event: any) {
    switch (event.currentTarget.id) {
      case "minutes":
        if (this.state.minutes < this.maxMin)
          this.setState({ minutes: this.state.minutes + this.state.incrementMinValue });
        break;
      case "hours":
        if (this.state.hours < this.maxHour)
          this.setState({ hours: this.state.hours + this.state.incrementHrsValue });
        break;
    }
  }

  render() {
    return (
      <Stack horizontal styles={stackStyles} disableShrink tokens={numericalSpacingStackTokens}>
        <Stack styles={stackStyles}>
          <IconButton title="CaretSolidUp" id="hours" iconProps={{ iconName: "CaretSolidUp" }} styles={buttonStyle} onClick={this.increment} />
          <TextField styles={narrowTextFieldStyles} value={this.state.hours.toString()} />
          <IconButton iconProps={{ iconName: "CaretSolidDown" }} styles={buttonStyle} />
          <Text> HRS </Text>
        </Stack>
        <Stack styles={stackStyles}>
          <IconButton title="CaretSolidUp" id="minutes" iconProps={{ iconName: "CaretSolidUp" }} styles={buttonStyle} onClick={this.increment} />
          <TextField styles={narrowTextFieldStyles} value={this.state.minutes.toString()} />
          <IconButton iconProps={{ iconName: "CaretSolidDown" }} styles={buttonStyle} />
          <Text> MIN </Text>
        </Stack>
      </Stack>
    )
  }
}