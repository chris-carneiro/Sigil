import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ClipboardCopy } from '../../../components/common/ClipboardCopy';

describe('ClipboardCopy', () => {
    let mockWriteText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockWriteText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', {
            clipboard: {
                writeText: mockWriteText,
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders label', () => {
        render(<ClipboardCopy label='Copy me' textCopy='test' />);
        expect(screen.getByText('Copy me')).toBeInTheDocument();
    });

    it('renders copy button with aria-label "Copy to clipboard"', () => {
        render(<ClipboardCopy textCopy='test' />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Copy to clipboard');
    });

    it('calls navigator.clipboard.writeText with textCopy when button clicked', async () => {
        render(<ClipboardCopy label='Copy' textCopy='test-content' />);
        const button = screen.getByRole('button');

        await act(async () => {
            await fireEvent.click(button);
        });

        expect(mockWriteText).toHaveBeenCalledWith('test-content');
    });

    it('shows checkmark icon after successful copy', async () => {
        render(<ClipboardCopy label='Copy' textCopy='test' />);
        const button = screen.getByRole('button');

        await act(async () => {
            await fireEvent.click(button);
        });
        expect(button).toHaveAttribute('aria-label', 'Copied');
    });

    it('shows error icon and message when copy fails', async () => {
        mockWriteText.mockRejectedValue(new Error('Permission denied'));
        render(<ClipboardCopy label='Copy' textCopy='test' />);
        const button = screen.getByRole('button');

        await act(async () => {
            await fireEvent.click(button);
        });
        expect(button).toHaveAttribute('aria-label', 'Copy failed');
        expect(screen.getByRole('alert')).toHaveTextContent('Permission denied');
    });
});
