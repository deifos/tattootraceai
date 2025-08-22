"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { UserMenu } from "@/components/user-menu";
import { Logo } from "@/components/icons";
import { GitHubStarButton } from "./github-star-button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
    <HeroUINavbar
      className="backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-divider py-2"
      isMenuOpen={isMenuOpen}
      maxWidth="xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo  />
            <p className="font-bold text-inherit hidden sm:block">TattooTraceAI</p>
            <p className="font-bold text-inherit sm:hidden">ttai</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <GitHubStarButton />
        <NavbarItem className="flex gap-3">
          <NextLink
            href="/dashboard"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Now
          </NextLink>
          <ThemeSwitch />
          <UserMenu onNavigate={() => setIsMenuOpen(false)} />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <UserMenu onNavigate={() => setIsMenuOpen(false)} />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <NextLink
                className={clsx(
                  "w-full text-lg",
                  index === siteConfig.navMenuItems.length - 1
                    ? "text-primary font-medium"
                    : "text-foreground"
                )}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>

    </>
  );
};
