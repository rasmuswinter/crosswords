import React from 'react';
import * as BS from 'react-bootstrap';

export function renderComponent({ input, meta, id, type, label, ...other }) {
  const inputProps = {
    ...other.inputProps,
    ...input,
    id,
    type
  };
  let validationState;
  if (meta.touched) {
    validationState = meta.error ? 'error' : 'success';
  }
  if (type === 'textarea') {
    inputProps.componentClass = type;
  }

  let fieldComponent;
  switch(type) {
    case 'radio-bar':
      fieldComponent = (
        <BS.ToggleButtonGroup type="radio"
                              bsSize="large"
                              name={input.name}
                              defaultValue={input.value}
                              justified>
          {
            other.options.map(option => {
              const radioProps = {
                ...inputProps,
                key: option.value,
                value: option.value,
                id: id + '_' + option.value,
                type: 'radio'
              };
              return <BS.ToggleButton {...radioProps}>{option.label}</BS.ToggleButton>;
            })
          }
        </BS.ToggleButtonGroup>
      );
      break;
    case 'checkbox':
      fieldComponent = <BS.Checkbox {...inputProps}>{other.text}</BS.Checkbox>;
      break;
    default:
      fieldComponent = <BS.FormControl {...inputProps} />;
  }

  return (
    <BS.FormGroup bsSize="large" validationState={validationState}>
      <BS.Col sm={3}>
        <BS.ControlLabel htmlFor={id}>{label}</BS.ControlLabel>
      </BS.Col>
      <BS.Col sm={9}>
        { fieldComponent }
        {validationState === 'error' && <div className="text-danger">{meta.error}</div>}
      </BS.Col>
    </BS.FormGroup>
  );
}

