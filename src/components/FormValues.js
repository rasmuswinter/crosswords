import React from 'react';
import { values as valuesDecorator } from 'redux-form';

const FormValues = ({ form, format = values => JSON.stringify(values, null, 2) }) => {
  const decorator = valuesDecorator({ form })
  const component = ({ values }) =>
    (
      <div>
        <h2>Values</h2>
        {format(values)}
      </div>
    )
  const Decorated = decorator(component)
  return <Decorated/>
}

export default FormValues;