import React from 'react';

import CrosswordForm from '../CrosswordForm';
import FormValues from '../form/FormValues';
import { crosswordTypes } from '../../mongo/constants';


export default class NewCrossword extends React.Component {
  handleSubmit(config) {
    console.log('CREATING A NEW CROSSWORD', config);
  }

  render() {
    const initialValues = {
      size: 15,
      gridType: crosswordTypes.NORMAL,
      gridCount: 1
    };

    return (
      <div>
        <h1>New crossword</h1>

        <div className="crossword-form new-crossword-form">
          <CrosswordForm onSubmit={values => this.handleSubmit(values)}
                         form="newCrossword"
                         buttonLabel="Create"
                         initialValues={initialValues} />
        </div>

        <FormValues form="newCrossword" />

      </div>
    );
  }
}