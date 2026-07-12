import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorDisplay } from '../../../components/common/ErrorDisplay';
import { AppError } from '../../../types';

describe('ErrorDisplay', () => {
    it('renders error code', () => {
        const error: AppError = { code: 'network-error', message: 'Failed to connect' };
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('network-error')).toBeInTheDocument();
    });

    it('renders error message', () => {
        const error: AppError = { code: 'network-error', message: 'Failed to connect' };
        render(<ErrorDisplay error={error} />);
        expect(screen.getByText('Failed to connect')).toBeInTheDocument();
    });

    it('has role=alert for accessibility', () => {
        const error: AppError = { code: 'network-error', message: 'Failed to connect' };
        render(<ErrorDisplay error={error} />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
    });

    it('displays both code and message for different error types', () => {
        const errors: AppError[] = [
            { code: 'network-error', message: 'Network failure' },
            { code: 'invalid-file', message: 'File is invalid' },
            { code: 'file-too-large', message: 'File exceeds limit' },
        ];

        for (const error of errors) {
            render(<ErrorDisplay error={error} />);
            expect(screen.getByText(error.code)).toBeInTheDocument();
            expect(screen.getByText(error.message)).toBeInTheDocument();
        }
    });
});
