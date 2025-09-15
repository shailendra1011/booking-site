import mongoose from 'mongoose';

/**
 * Checks if a value is a valid MongoDB ObjectId.
 * @param {string} value - The value to check.
 * @returns {boolean} True if valid, otherwise false.
 */
export function isValidObjectId(value) {
    return mongoose.Types.ObjectId.isValid(value);
}

