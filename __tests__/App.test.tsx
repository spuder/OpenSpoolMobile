/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', async () => {
  let tree: renderer.ReactTestRenderer | undefined;
  // Flush mount effects (e.g. the dropdowns' Dimensions listeners) inside the test
  await renderer.act(async () => {
    tree = renderer.create(<App />);
  });
  tree?.unmount();
});
