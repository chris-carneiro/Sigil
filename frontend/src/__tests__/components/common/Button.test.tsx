import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../components/common/Button';

describe('Button', () => {
    it('renders with label text', () => {
        render(<Button label='Click me' />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('has type button by default', () => {
        render(<Button label='Click' />);
        const button = screen.getByRole('button', { name: 'Click' });
        expect(button).toHaveAttribute('type', 'button');
    });

    it('passes through onClick handler and fires when clicked', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Button label='Click' onClick={handleClick} />);
        
        await user.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom className', () => {
        render(<Button label='Click' className='custom-class' />);
        const button = screen.getByRole('button', { name: 'Click' });
        expect(button).toHaveClass('custom-class');
    });

    it('passes through disabled prop and prevents clicks', async () => {
        const handleClick = vi.fn();
        const user = userEvent.setup();
        render(<Button label='Disabled' onClick={handleClick} disabled />);
        
        const button = screen.getByRole('button', { name: 'Disabled' });
        expect(button).toBeDisabled();
        
        await user.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('passes through aria-label', () => {
        render(<Button label='Click' aria-label='Custom label' />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Custom label');
    });
});
