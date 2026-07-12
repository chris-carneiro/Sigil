import { describe, expect, it } from 'vitest';
import { withMinimumDuration } from '../../utils/async';

describe('withMinimumDuration', () => {
    it('should return result when promise resolves before minimum duration', async () => {
        const fastPromise = Promise.resolve('result');
        const result = await withMinimumDuration(fastPromise, 100);
        expect(result).toBe('result');
    });

    it('should wait for minimum duration even if promise resolves quickly', async () => {
        const start = Date.now();
        const fastPromise = Promise.resolve('result');
        await withMinimumDuration(fastPromise, 50);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(49);
    });

    it('should return result when promise takes longer than minimum duration', async () => {
        const slowPromise = new Promise((resolve) => setTimeout(() => resolve('slow-result'), 100));
        const result = await withMinimumDuration(slowPromise, 50);
        expect(result).toBe('slow-result');
    });

    it('should work with different promise types', async () => {
        const numberPromise = Promise.resolve(42);
        const result = await withMinimumDuration(numberPromise, 10);
        expect(result).toBe(42);
    });
});
