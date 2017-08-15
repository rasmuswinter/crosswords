import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import * as BS from 'react-bootstrap';
import { connect } from 'react-redux';

import { crosswordTypes } from '../mongo/constants';
import { renderComponent } from './form/formUtils';

const required = val => val ? undefined : 'Required';

function mapStoreToProps(state, ownProps) {
  const props = {};
  if (ownProps.form) {
    const newFormSelector = formValueSelector(ownProps.form);
    props.typeValue = newFormSelector(state, 'gridType');
  }

  //todo: use https://github.com/reactjs/reselect

  return props;
}

@reduxForm()
@connect(mapStoreToProps)
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
                         text="Instead of numbers, clues are given by letter, and have to be fit where they can, jigsaw-style"/>
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
CrosswordForm.propTypes = {
  buttonLabel: PropTypes.string.isRequired
};
