/**
 * Date utilities for appointment system
 * 
 * This module provides utility functions for date and time operations
 * used throughout the application.
 */

import { addDays, endOfDay, format, isValid, parseISO, startOfDay } from 'date-fns';

/**
 * Formats a date string to a readable format
 * 
 * @param dateString - ISO date string
 * @param formatString - Date format string (default: 'dd/MM/yyyy')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatString: string = 'dd/MM/yyyy'): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Formats a date string to include time
 * 
 * @param dateString - ISO date string
 * @param formatString - Date format string (default: 'dd/MM/yyyy HH:mm')
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string, formatString: string = 'dd/MM/yyyy HH:mm'): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Formats time from a date string
 * 
 * @param dateString - ISO date string
 * @param formatString - Time format string (default: 'HH:mm')
 * @returns Formatted time string
 */
export function formatTime(dateString: string, formatString: string = 'HH:mm'): string {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid Time';
    }
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Time';
  }
}

/**
 * Converts a date to ISO string format for API calls
 * 
 * @param date - Date object or string
 * @returns ISO date string (YYYY-MM-DD format)
 */
export function toISODateString(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    throw new Error('Invalid date format');
  }
}

/**
 * Converts a date to ISO datetime string format for API calls
 * 
 * @param date - Date object or string
 * @returns ISO datetime string
 */
export function toISODateTimeString(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Invalid date');
    }
    return dateObj.toISOString();
  } catch (error) {
    throw new Error('Invalid date format');
  }
}

/**
 * Checks if a date is in the past
 * 
 * @param dateString - ISO date string
 * @returns True if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return false;
    }
    return date < new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Gets the start of day for a given date
 * 
 * @param date - Date object or string
 * @returns Start of day date
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return startOfDay(dateObj);
}

/**
 * Gets the end of day for a given date
 * 
 * @param date - Date object or string
 * @returns End of day date
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return endOfDay(dateObj);
}

/**
 * Adds days to a date
 * 
 * @param date - Date object or string
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return addDays(dateObj, days);
}

/**
 * Validates if a date string is valid
 * 
 * @param dateString - Date string to validate
 * @returns True if date is valid
 */
export function isValidDate(dateString: string): boolean {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
}

/**
 * Gets the current date in ISO format
 * 
 * @returns Current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Gets the current datetime in ISO format
 * 
 * @returns Current datetime in ISO format
 */
export function getCurrentDateTime(): string {
  return new Date().toISOString();
} 