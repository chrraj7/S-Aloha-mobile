import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0f4c81',
        headerStyle: { backgroundColor: '#0f4c81' },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tickets ITIL' }} />
      <Tabs.Screen name="cmdb" options={{ title: 'CMDB' }} />
      <Tabs.Screen name="nis2" options={{ title: 'NIS 2 / ReCyF' }} />
      <Tabs.Screen name="perimeters" options={{ title: 'Perimetres & Alertes' }} />
    </Tabs>
  );
}
