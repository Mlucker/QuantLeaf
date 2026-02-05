import { describe, it, expect } from 'vitest';
import {
    calculateGrahamNumber,
    calculateDiscountRate,
    calculateSimpleDCF,
    calculateOwnerEarningsYield,
    calculatePEGValue,
    calculateDDM
} from './formulas';

describe('Financial Formulas', () => {

    describe('calculateGrahamNumber', () => {
        it('should calculate correctly for positive values', () => {
            // V = SQRT(22.5 * 1.5 * 10) = SQRT(337.5) ≈ 18.37
            const result = calculateGrahamNumber(1.5, 10);
            expect(result).toBeCloseTo(18.37, 2);
        });

        it('should return 0 for negative EPS', () => {
            expect(calculateGrahamNumber(-1.5, 10)).toBe(0);
        });
    });

    describe('calculateDiscountRate', () => {
        it('should calculate correct CAPM rate for Beta 1.0', () => {
            // 0.045 + (1.0 * 0.06) = 0.105
            expect(calculateDiscountRate(1.0)).toBeCloseTo(0.105, 3);
        });

        it('should calculate correct CAPM rate for Beta 1.5', () => {
            // 0.045 + (1.5 * 0.06) = 0.045 + 0.09 = 0.135
            expect(calculateDiscountRate(1.5)).toBeCloseTo(0.135, 3);
        });
    });

    describe('calculateSimpleDCF', () => {
        it('should generate 5 year projections', () => {
            const result = calculateSimpleDCF(100, 0.10, 0.10);
            expect(result.projections).toHaveLength(5);
        });

        it('should discount future cash flows correctly', () => {
            // Year 1: 100 * 1.1 / 1.1 = 100
            const result = calculateSimpleDCF(100, 0.10, 0.10);
            expect(result.projections[0].discountedValue).toBeCloseTo(100, 1);
        });

        it('should handle zero discount rate gracefully', () => {
            const result = calculateSimpleDCF(100, 0.10, 0);
            expect(result.value).toBe(0); // Should return 0 as failsafe or handle logically
        });
    });

    describe('calculateOwnerEarningsYield', () => {
        it('should calculate yield correctly', () => {
            // Net Income (100) + Dep (20) - Capex (30) = 90
            // Market Cap (1000)
            // 90 / 1000 = 0.09 = 9%
            const result = calculateOwnerEarningsYield(100, 20, 30, 1000);
            expect(result).toBeCloseTo(9.0, 1);
        });
    });

    describe('calculatePEGValue', () => {
        it('should return fair value based on Lynch rule', () => {
            // EPS 2.0, Growth 15% (0.15)
            // Fair PE = 15
            // Fair Value = 2.0 * 15 = 30
            const result = calculatePEGValue(2.0, 0.15, 45);
            expect(result.fairValue).toBe(30);
            expect(result.fairPE).toBe(15);
        });

        it('should calculate PEG ratio correctly', () => {
            // EPS 2.0, Price 60, Growth 15%
            // PE = 30
            // PEG = 30 / 15 = 2.0
            const result = calculatePEGValue(2.0, 0.15, 60);
            expect(result.pegRatio).toBeCloseTo(2.0, 1);
        });
    });

    describe('calculateDDM', () => {
        it('should calculate Gordon Growth Model correctly', () => {
            // Div 1.0, Growth 2%
            // r = 9%
            // Next Div = 1.02
            // 1.02 / (0.09 - 0.02) = 1.02 / 0.07 ≈ 14.57
            const result = calculateDDM(1.0, 0.02);
            expect(result).toBeCloseTo(14.57, 2);
        });
    });

});
