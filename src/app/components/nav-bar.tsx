'use client';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
} from '@headlessui/react';
import { Bars3Icon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { siteConfig } from '@/constant/config';
import { coinbaseConnector } from '../contexts/wagmiConfig';

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Attestations', href: '/manage', current: false },
  { name: 'Verify', href: '/verify', current: false },
  { name: 'About', href: '/about', current: false },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  let chain: any;

  const abbreviateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Disclosure as='nav' className='bg-primary-900'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            {/* Mobile menu button*/}
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon
                aria-hidden='true'
                className='block size-6 group-data-open:hidden'
              />
              <XMarkIcon
                aria-hidden='true'
                className='hidden size-6 group-data-open:block'
              />
            </DisclosureButton>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex shrink-0 items-center'>
              <ShieldCheckIcon className='h-8 w-8 text-white' />
              <span className='ml-2 text-xl font-bold text-white hidden sm:block'>
                {siteConfig.title}
              </span>
            </div>
            <div className='hidden sm:ml-6 sm:block'>
              <div className='flex space-x-4'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            <span className='text-white text-sm font-medium mr-4'>
              {chain?.name || siteConfig.defaultChain.name}
            </span>
            {!address ? (
              <button
                onClick={() =>
                  connect({
                    connector: coinbaseConnector,
                    chainId: siteConfig.defaultChain.id,
                  })
                }
                className='rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600'
              >
                Connect for Attestation
              </button>
            ) : (
              <Menu as='div' className='relative'>
                <MenuButton className='text-white text-sm font-medium px-3 py-2 bg-primary-700 rounded-md cursor-pointer hover:bg-primary-600'>
                  {abbreviateAddress(address)}
                </MenuButton>
                <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => disconnect()}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700',
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className='sm:hidden'>
        <div className='space-y-1 px-2 pt-2 pb-3'>
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as='a'
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:bg-primary-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
