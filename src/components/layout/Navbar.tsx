'use client';

import Link from 'next/link';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/hooks/useAuth';
import { navbarItems, navbarUserMenu } from '@/lib/constants/navbarItems';
import { Button } from '@/components/Button';
import { Fragment } from 'react';
import RequireAuth from '@/modules/auth/components/RequireAuth';
import { Avatar } from '../Avatar';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Disclosure
      as="nav"
      className="fixed left-0 top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Logo/Brand */}
              <div className="flex flex-shrink-0 items-center text-2xl font-bold text-primary">
                Cali Joven
              </div>

              {/* Center: Navigation */}
              <div className="hidden md:flex md:gap-6">
                {navbarItems.map((item) =>
                  item.children ? (
                    <Menu as="div" className="relative" key={item.label}>
                      <MenuButton className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none">
                        {item.label}
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-card py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                          {item.children.map((sub) => (
                            <MenuItem key={sub.label}>
                              {({ active }) => (
                                <Link
                                  href={sub.href!}
                                  className={classNames(
                                    active ? 'bg-accent text-accent-foreground' : '',
                                    'block px-4 py-2 text-sm text-foreground'
                                  )}
                                >
                                  {sub.label}
                                </Link>
                              )}
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>

              {/* Right: Auth buttons or Avatar */}
              <div className="flex items-center gap-2">
                <RequireAuth
                  fallback={
                    <>
                      <Link href="/register" className="hidden md:block">
                        <Button variant="outline" size="sm">
                          Registrarse
                        </Button>
                      </Link>
                      <Link href="/login" className="hidden md:block">
                        <Button size="sm">Iniciar Sesión</Button>
                      </Link>
                    </>
                  }
                >
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="hidden rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:flex">
                      <span className="sr-only">Abrir menú de usuario</span>
                      <Avatar src={user?.profilePicture} size="md" />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-card py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {navbarUserMenu.map((item) => (
                          <MenuItem key={item.label}>
                            {({ active }) =>
                              item.label === 'Cerrar sesión' ? (
                                <button
                                  onClick={logout}
                                  className={classNames(
                                    active ? 'bg-muted text-foreground' : '',
                                    'flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground'
                                  )}
                                >
                                  {item.icon}
                                  {item.label}
                                </button>
                              ) : (
                                <Link
                                  href={item.href!}
                                  className={classNames(
                                    active ? 'bg-muted text-foreground' : '',
                                    'flex items-center gap-2 px-4 py-2 text-sm text-foreground'
                                  )}
                                >
                                  {item.icon}
                                  {item.label}
                                </Link>
                              )
                            }
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                </RequireAuth>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                    <span className="sr-only">Abrir menú principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navbarItems.map((item) =>
                item.children ? (
                  <Menu as="div" className="relative" key={item.label}>
                    <MenuButton className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                      {item.label}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-card py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {item.children.map((sub) => (
                          <MenuItem key={sub.label}>
                            {({ active }) => (
                              <Link
                                href={sub.href!}
                                className={classNames(
                                  active ? 'bg-accent text-accent-foreground' : '',
                                  'block px-4 py-2 text-sm text-foreground'
                                )}
                              >
                                {sub.label}
                              </Link>
                            )}
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="mt-2 border-t border-border pt-2">
                <RequireAuth
                  fallback={
                    <>
                      <Link href="/register">
                        <Button variant="outline" size="sm" className="mb-2 w-full">
                          Registrarse
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button size="sm" className="w-full">
                          Iniciar Sesión
                        </Button>
                      </Link>
                    </>
                  }
                >
                  <div className="flex flex-col gap-1">
                    {navbarUserMenu.map((item) =>
                      item.label === 'Cerrar sesión' ? (
                        <button
                          key={item.label}
                          onClick={logout}
                          className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.label}
                          href={item.href!}
                          className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-foreground"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                </RequireAuth>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
