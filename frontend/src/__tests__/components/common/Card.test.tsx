import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../../../components/common/Card';

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card><p>Test content</p></Card>);
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies danger variant class when variant is danger', () => {
        render(<Card variant='danger'><p>Danger</p></Card>);
        const card = screen.getByText('Danger').parentElement;
        expect(card?.className).toMatch(/danger/);
    });

    it('does not apply danger class when variant is default', () => {
        render(<Card variant='default'><p>Default</p></Card>);
        const card = screen.getByText('Default').parentElement;
        expect(card?.className).not.toMatch(/danger/);
    });

    it('applies custom className', () => {
        render(<Card className='custom'><p>Custom</p></Card>);
        const card = screen.getByText('Custom').parentElement;
        expect(card?.className).toMatch(/custom/);
    });

    it('combines variant and custom className', () => {
        render(<Card variant='danger' className='custom'><p>Combined</p></Card>);
        const card = screen.getByText('Combined').parentElement;
        expect(card?.className).toMatch(/danger/);
        expect(card?.className).toMatch(/custom/);
    });
});
