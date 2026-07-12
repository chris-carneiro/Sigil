import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentId } from '../../../components/common/DocumentId';

describe('DocumentId', () => {
    it('renders documentId when provided', () => {
        render(<DocumentId documentId='abc-123' />);
        expect(screen.getByText('abc-123')).toBeInTheDocument();
    });

    it('renders N/A when documentId is undefined', () => {
        render(<DocumentId />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('renders N/A when documentId is null', () => {
        render(<DocumentId documentId={null} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('renders empty span when documentId is empty string', () => {
        const { container } = render(<DocumentId documentId='' />);
        const span = container.querySelector('span');
        expect(span?.tagName).toBe('SPAN');
        expect(span?.textContent).toBe('');
    });

    it('applies custom className', () => {
        render(<DocumentId documentId='abc-123' className='custom' />);
        const container = screen.getByText('abc-123').parentElement;
        expect(container).toHaveClass('custom');
    });

    it('does not render undefined to DOM', () => {
        render(<DocumentId documentId={undefined} />);
        expect(screen.getByText('N/A')).toBeInTheDocument();
    });
});
