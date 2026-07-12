import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareActions } from '../../../components/common/ShareActions';

// Mock navigator.share
let mockShare: () => Promise<void>;

describe('ShareActions', () => {
    beforeEach(() => {
        mockShare = vi.fn().mockResolvedValue({});
        vi.stubGlobal('navigator', {
            share: mockShare,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders ClipboardCopy component with url', () => {
        render(<ShareActions url='https://example.com' />);
        expect(screen.getByText('Copy link to clipboard')).toBeInTheDocument();
    });

    it('shows share button when navigator.share is available', () => {
        render(<ShareActions url='https://example.com' />);
        const shareButton = screen.queryByLabelText('Share document');
        expect(shareButton).toBeInTheDocument();
    });

    it('does not show share button when navigator.share is not available', () => {
        vi.stubGlobal('navigator', {});
        render(<ShareActions url='https://example.com' />);
        const shareButton = screen.queryByLabelText('Share document');
        expect(shareButton).not.toBeInTheDocument();
    });

    it('calls navigator.share with correct parameters when share button clicked', async () => {
        const user = userEvent.setup();
        render(<ShareActions url='https://example.com/doc-123' />);

        await user.click(screen.getByLabelText('Share document'));

        expect(mockShare).toHaveBeenCalledWith({
            url: 'https://example.com/doc-123',
            title: 'Secure document',
        });
    });

    it('applies custom className', () => {
        render(<ShareActions url='https://example.com' className='custom' />);
        const container = screen.getByText('Copy link to clipboard').parentElement?.parentElement;
        expect(container).toHaveClass('custom');
    });
});
