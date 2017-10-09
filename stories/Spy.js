import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

// FEATURED COMPONENT //
import Spy from '../src';


function onChange(e) {
  console.log('onChange => ', e);
}

// Start of story logic
const stories = storiesOf('Spy', module);

stories.add('Spy',
  withInfo({ text: 'Spying!' })(() => {
    return (
      <div className='page'>
        <Spy onChange={ onChange }>
          <div className='thing' id='thing-1' style={ { background: 'red' } }>Thing 1</div>
          <div className='thing' id='thing-2' style={ { background: 'blue' } }>Thing 2</div>
          <div className='thing' id='thing-3' style={ { background: 'goldenrod' } }>Thing 3</div>
          <div className='thing' id='thing-4' style={ { background: 'lime' } }>Thing 4</div>
          <div className='thing' id='thing-5' style={ { background: 'hotpink' } }>Thing 5</div>
        </Spy>
      </div>
    );
  })
);