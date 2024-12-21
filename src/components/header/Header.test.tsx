import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import { useWalletStore } from '@/store/walletStore';
import { useWallet } from '@/wallet/hooks/useWallet.hook';
import { useRouter } from 'next/navigation';

// Mock dependencies for wallet and router
jest.mock('@/store/walletStore', () => ({
  useWalletStore: jest.fn(),
}));
jest.mock('@/wallet/hooks/useWallet.hook', () => ({
  useWallet: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Header Component', () => {
  let connectWallet: jest.Mock;
  let disconnectWallet: jest.Mock;
  let push: jest.Mock;

  beforeEach(() => {
    connectWallet = jest.fn();
    disconnectWallet = jest.fn();
    push = jest.fn();

    (useWallet as jest.Mock).mockReturnValue({
      connectWallet,
      disconnectWallet,
    });

    (useWalletStore as jest.Mock).mockReturnValue({
      address: null,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push,
    });
  });

  // Test to ensure the header renders correctly with navigation and wallet options
  it('renders header with logo, navigation, and connect wallet button (desktop)', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const logo = screen.getByAltText('Website logo');
    expect(logo).toBeInTheDocument();

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    expect(connectButton).toBeInTheDocument();
  });

  // Test for mobile menu rendering and interaction
  it('renders and toggles mobile menu', () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();

    // Open the mobile menu
    fireEvent.click(menuButton);
    const closeButton = screen.getByLabelText('Close menu');
    expect(closeButton).toBeInTheDocument();

    // Close the menu
    fireEvent.click(closeButton);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  // Test to verify connect and disconnect wallet functionality
  it('connects and disconnects wallet', async () => {
    render(<Header />);

    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    fireEvent.click(connectButton);

    expect(connectWallet).toHaveBeenCalledTimes(1);

    // Simulate connected wallet
    (useWalletStore as jest.Mock).mockReturnValue({
      address: '0x1234',
    });

    render(<Header />);
    const disconnectButton = screen.getByRole('button', { name: /disconnect wallet/i });
    fireEvent.click(disconnectButton);

    expect(disconnectWallet).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/en');
  });

  // Test navigation functionality by clicking the logo
  it('navigates to home when clicking the logo', () => {
    render(<Header />);

    const logoButton = screen.getByLabelText('Home');
    fireEvent.click(logoButton);

    expect(push).toHaveBeenCalledWith('/en');
  });

  // Accessibility test for navigation
  it('meets accessibility requirements', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  // Test for wallet disconnect and menu closure on mobile
  it('disconnects wallet and closes mobile menu on disconnect', () => {
    (useWalletStore as jest.Mock).mockReturnValue({
      address: '0x1234',
    });

    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    const disconnectButton = screen.getByRole('button', { name: /disconnect wallet/i });
    fireEvent.click(disconnectButton);

    expect(disconnectWallet).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/en');
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  // Ensure that body scroll is disabled when the mobile menu is open
  it('disables body scroll when mobile menu is open', () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(document.body.style.overflow).toBe('unset');
  });
});
