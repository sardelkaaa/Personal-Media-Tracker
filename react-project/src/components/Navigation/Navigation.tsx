import React, { useState } from "react";
import { Anchor, Flex, Burger, Group, Menu, Drawer, Stack, AppShell } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import { IconHome2, IconLayoutDashboard, IconMovie, IconUserCircle } from '@tabler/icons-react';
import type { MobileNavigationProps } from "../../types/types";

const NavigationItems = [
        {
            label: "Главная",
            path: "/",
            icon: IconHome2
        },
        {
            label: "Дашборд",
            path: "/dashboard",
            icon: IconLayoutDashboard
        },
        {
            label: "Каталог",
            path: "/catalogue",
            icon: IconMovie
        },
        {
            label: "Профиль",
            path: "/profile",
            icon: IconUserCircle
        },
    ]

    const DesktopNavigation = () => (
        <Flex gap={30}>
            {NavigationItems.map((item) => (
                <Anchor 
                key={item.path}
                component={Link} 
                to={item.path} 
                underline="never">
                    {item.label}
                </Anchor>
            ))}
        </Flex>
    );
    
    const MobileNavigation: React.FC<MobileNavigationProps> = ({opened, toggle, close}) => (
        <>
            <Burger opened={opened} onClick={toggle} aria-label="Открыть меню"/>
            <Drawer opened={opened} onClose={close} title="Меню" size="md" position="left" withCloseButton={true}>
                <Menu>
                    {NavigationItems.map((item) => (
                        <Menu.Item
                            key={item.path} 
                            component={Link} 
                            to={item.path}
                            onClick={close}
                            leftSection={<item.icon size={14} />}
                        >
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu>
            </Drawer>
        </>
    );

export const Navigation = () => {
    const [opened, {toggle, close}] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <>
               {!isMobile && <DesktopNavigation />}
               {isMobile && <MobileNavigation opened={opened} toggle={toggle} close={close} />}
        </>
    );
}