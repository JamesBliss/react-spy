import React from 'react';
import { configure, addDecorator, setAddon } from '@storybook/react';
import infoAddon from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

import './storybook.scss';

setOptions({
  name: 'react-spy',
  url: 'https://github.com/JamesBliss/react-spy',
  showDownPanel: false
})

function loadStories() {
  require('../stories/Spy');
}

setAddon(infoAddon);

configure(loadStories, module);
