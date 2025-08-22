import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar';
import NextLink from 'next/link';

import { ThemeSwitch } from '@/components/theme-switch';
import { UserMenu } from '@/components/user-menu';
import { CreditsDisplay } from '@/components/credits-display';
import { Logo } from '@/components/icons';
import { siteConfig } from '@/config/site';

interface DashboardNavbarProps {
  userId?: string;
}

export const DashboardNavbar = ({ userId }: DashboardNavbarProps) => {
  return (
    <HeroUINavbar
      className='backdrop-blur supports-[backdrop-filter]:bg-background/60'
      maxWidth='xl'
      position='sticky'
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink className='flex justify-start items-center gap-1' href='/'>
            <Logo />
            <p className='font-bold text-inherit'>{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='basis-1/5 sm:basis-full' justify='end'>
        <NavbarItem className='flex gap-4 items-center'>
          {userId && <CreditsDisplay userId={userId} compact />}
          <ThemeSwitch />
          <UserMenu />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
