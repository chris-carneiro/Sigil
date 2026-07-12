import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SigilIndicator } from '../../../components/common/SigilIndicator';

describe('SigilIndicator', () => {
    it('renders label text', () => {
        render(<SigilIndicator label='Sigil' alt='Sigil logo' />);
        expect(screen.getByText('Sigil')).toBeInTheDocument();
    });

    it('renders img with correct alt text', () => {
        render(<SigilIndicator label='Sigil' alt='Sigil logo' />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('alt', 'Sigil logo');
    });

    it('renders img with src pointing to sigil mark', () => {
        render(<SigilIndicator label='Sigil' alt='Sigil logo' />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', expect.stringContaining('sigil_mark_light.svg'));
    });

    it('has container with logo and label', () => {
        render(<SigilIndicator label='Sigil' alt='Sigil logo' />);
        const container = screen.getByText('Sigil').parentElement;
        expect(container?.querySelector('img')).toBeInTheDocument();
        expect(container?.querySelector('p')).toBeInTheDocument();
    });
});
