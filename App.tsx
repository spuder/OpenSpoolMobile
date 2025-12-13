import React from 'react';
import { CustomDrawerContent } from './components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import OpenSpool from './components/OpenSpool';
import { TagModalProvider } from './contexts/TagModal';

const MyDrawer = createDrawerNavigator();

function customerDrawerContent(props: any) {
  return <CustomDrawerContent {...props} />;
}

const App = () => (
  <TagModalProvider>
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
            headerTitleAlign: 'center',
            headerTintColor: 'white',
          }} />
      </MyDrawer.Navigator>
    </NavigationContainer>
  </TagModalProvider>
);

export default App;
