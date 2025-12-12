import React from 'react';
import { CustomDrawerContent } from './components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import OpenSpool from './components/OpenSpool';

const MyDrawer = createDrawerNavigator();



function customerDrawerContent(props: any) {
  return <CustomDrawerContent {...props} />;
}

const App = () => (
  <NavigationContainer>
    <MyDrawer.Navigator drawerContent={customerDrawerContent}>
      <MyDrawer.Screen
        name="OpenSpool"
        component={OpenSpool}
        options={{
          headerTitle: 'OpenSpool',
          headerTitleContainerStyle: {
            padding: 0,
            margin: 0,
          },
          headerTitleStyle: {
            fontSize: 30,
            fontFamily: 'Orbitron-Regular',
            textAlign: 'center',
            color: '#ffffff',
          },
          drawerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
        }} />
    </MyDrawer.Navigator>
  </NavigationContainer>
);

export default App;
