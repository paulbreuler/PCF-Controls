# Duration Picker
A react based duration picker that allows user to enter hours and minutes manually, by clicking the arrows, or using key press events on the chevrons.

## How to test locally
1. Run `npm i` to install all node modules.
2. Run `npm run build` to build the project
3. Run `npm start` to test things out.

## How to install
 - Reference the Microsft Docs [import custom controls](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/import-custom-controls) article.

## Notes
- To disable stepping minutes by 5 set remove the property `allowSteppedVariation` from the index file in the `IDurationPickerProps` object.