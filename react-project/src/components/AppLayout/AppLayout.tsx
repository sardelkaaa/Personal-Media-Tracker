import { AppShell } from '@mantine/core';
import { Navigation } from '../Navigation/Navigation';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <AppShell>
      <AppShell.Header>
        <Navigation />
      </AppShell.Header>
      
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};