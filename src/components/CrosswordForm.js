import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { crosswordTypes } from '../mongo/constants';
import CrosswordGrid from "./CrosswordGrid";

function renderComponent({ input, meta, id, type, label, ...other }) {
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
                              value={input.value}
                              justified>
          {
            other.options.map(option => {
              const radioProps = {
                ...inputProps,
                key: option.value,
                value: option.value,
                id: id + '_' + option.value
              };
              return <BS.ToggleButton {...radioProps}>{option.label}</BS.ToggleButton>;
            })
          }
        </BS.ToggleButtonGroup>
      );
      break;
    case 'checkbox':
      fieldComponent = <BS.Checkbox {...inputProps}>{other.inputProps.text}</BS.Checkbox>;
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

const required = val => val ? undefined : 'Required';

@reduxForm()
@connect((state, ownProps) => {
  const props = {};
  if (ownProps.form) {
    const newFormSelector = formValueSelector(ownProps.form);
    props.typeValue = newFormSelector(state, 'gridType');
  }
  return props;
})
export default class CrosswordForm extends React.Component {
  render() {
    const { handleSubmit, typeValue, buttonLabel, submitFailed } = this.props;

    return (
      <BS.Form horizontal onSubmit={handleSubmit}>
        <BS.Row>
          <BS.Col sm={6}>
            <Field id="config_number"
                   name="number"
                   type="number"
                   label="Number"
                   normalize={value => parseInt(value)}
                   inputProps={{min: 1}}
                   component={renderComponent}
                   validate={[required]} />

            <Field id="config_setter"
                   name="setter"
                   type="text"
                   label="Setter"
                   component={renderComponent}
                   validate={[required]} />

            <Field id="config_date"
                   name="date"
                   type="date"
                   label="Date"
                   component={renderComponent} />
          </BS.Col>

          <BS.Col sm={6}>
            <Field id="config_type"
                   name="gridType"
                   type="radio-bar"
                   label="Type"
                   options={[
                     { value: crosswordTypes.NORMAL, label: 'Normal'},
                     { value: crosswordTypes.SPECIAL, label: 'Special'}
                   ]}
                   component={renderComponent}
                   validate={[required]} />

            {
              typeValue === crosswordTypes.SPECIAL &&
                <div>
                  <Field id="config_alphabet"
                         name="alphabet"
                         type="checkbox"
                         label="Alphabet"
                         component={renderComponent}
                         inputProps={{text: 'Instead of numbers, clues are given alphabetically, and have to be fit, jigsaw-wise'}}/>
                  <Field id="config_count"
                         name="gridCount"
                         type="number"
                         label="Grids"
                         normalize={value => parseInt(value)}
                         inputProps={{min: 1, max: 3}}
                         component={renderComponent}
                         validate={[required]} />
                  <Field id="config_size"
                         name="size"
                         type="number"
                         label="Size"
                         normalize={value => parseInt(value)}
                         inputProps={{min: 1, max: 30}}
                         component={renderComponent}
                         validate={[required]} />
                </div>
            }

            <Field id="config_notes"
                   name="notes"
                   type="textarea"
                   label="Notes"
                   component={renderComponent}
                   inputProps={{rows: 4}} />
          </BS.Col>
        </BS.Row>

        <div className="text-right submission">
          { submitFailed && <span className="text-danger">Validation failed</span> }
          <BS.Button bsSize="large"
                     bsStyle="primary"
                     type="submit">{buttonLabel}</BS.Button>
        </div>
      </BS.Form>
    );
  }
}
CrosswordGrid.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};
