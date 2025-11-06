import { DateTime } from 'luxon';
import { Timestamp } from 'firebase/firestore';

/**
 * Date formatting and conversion utility using Luxon and Firestore Timestamp.
 * Provides helpers for relative time, localization, and Firestore data parsing.
 */
class FormatDate {
	/**
	 * Converts a given date into a relative string (e.g., "2 hours ago", "in 3 days").
	 * Handles French localization and plural forms.
	 *
	 * @param {Date | string | Timestamp} input - A JS Date, ISO string, or Firestore Timestamp.
	 * @returns {string}
	 */
	public static toRelative(input: Date | string | Timestamp): string {
		const date = this.resolveToDate(input);
		const dt = DateTime.fromJSDate(date);
		const now = DateTime.now();

		const diff = now.diff(dt, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();

		const units: { [K in keyof typeof diff]: string } = {
			years: 'an',
			months: 'mois',
			days: 'jour',
			hours: 'heure',
			minutes: 'minute',
			seconds: 'seconde'
		};

		for (const [unit, value] of Object.entries(diff)) {
			if (value && Math.abs(value) >= 1) {
				const rounded = Math.round(Math.abs(value));
				const plural = rounded > 1 && unit !== 'mois' ? 's' : '';
				const label = `${rounded} ${units[unit as keyof typeof units]}${plural}`;
				return dt < now ? `Il y a ${label}` : `dans ${label}`;
			}
		}
		return 'À l’instant';
	}

	/**
	 * Recursively converts all Firestore Timestamps within an object (including nested fields)
	 * into native JS Date instances.
	 *
	 * @template T
	 * @param {T} data - Input object (Firestore document or nested data).
	 * @returns {T} A deep copy of the object with all Timestamps converted to Date.
	 */
	public static timestampToDate<T extends Record<string, unknown>>(data: T): T {
		const convert = (value: unknown): unknown => {
			if (value instanceof Timestamp) return value.toDate();
			if (Array.isArray(value)) return value.map(convert);

			if (typeof value === 'object' && value !== null) {
				return Object.entries(value).reduce((acc, [k, v]) => {
					(acc as Record<string, unknown>)[k] = convert(v);
					return acc;
				}, {} as Record<string, unknown>);
			}

			return value;
		};

		return convert(data) as T;
	}

	/**
	 * Converts any ISO-8601 strings in an object (including nested fields)
	 * into native JS Date instances.
	 *
	 * Example:
	 *   FormatDate.isoToDate({ created: "2025-10-17T03:33:53.469Z" })
	 *   → { created: Date("2025-10-17T03:33:53.469Z") }
	 */
	public static isoToDate<T extends Record<string, unknown>>(data: T): T {
		const convert = (value: unknown): unknown => {
			if (typeof value === 'string') {
				const d = new Date(value);
				if (!Number.isNaN(d.getTime())) return d;
			}

			if (Array.isArray(value)) return value.map(convert);

			if (typeof value === 'object' && value !== null) {
				return Object.entries(value).reduce((acc, [k, v]) => {
					(acc as Record<string, unknown>)[k] = convert(v);
					return acc;
				}, {} as Record<string, unknown>);
			}

			return value;
		};

		return convert(data) as T;
	}

	/**
	 * Recursively converts all Date-like values (Date, ISO string, Luxon DateTime)
	 * into Firestore Timestamp instances. Useful before writing data to Firestore.
	 *
	 * @template T
	 * @param {T} data - Input object containing Date or Timestamp fields.
	 * @returns {T} Deep copy with all dates converted to Firestore Timestamps.
	 */
	public static dateToTimestamp<T extends Record<string, unknown>>(data: T): T {
		const convert = (value: unknown): unknown => {
			if (value instanceof Date) return Timestamp.fromDate(value);
			if (value instanceof DateTime) return Timestamp.fromDate(value.toJSDate());

			if (typeof value === 'string') {
				const d = new Date(value);
				if (!Number.isNaN(d.getTime())) return Timestamp.fromDate(d);
			}

			if (Array.isArray(value)) return value.map(convert);

			if (typeof value === 'object' && value !== null) {
				return Object.entries(value).reduce((acc, [k, v]) => {
					(acc as Record<string, unknown>)[k] = convert(v);
					return acc;
				}, {} as Record<string, unknown>);
			}

			return value;
		};

		return convert(data) as T;
	}

	/**
	 * Converts a date into a localized human-readable string.
	 * Example: "12 octobre 2025 à 14:35"
	 *
	 * @param {Date | string | Timestamp} date - Date input to format.
	 * @param {string} [locale='fr'] - Optional locale code (default: 'fr').
	 * @returns {string} Localized formatted date string.
	 */
	public static toLocaleString(date: Date | string | Timestamp, locale = 'fr'): string {
		const dt = DateTime.fromJSDate(this.resolveToDate(date)).setLocale(locale);
		return dt.toFormat("d LLLL yyyy 'à' HH:mm");
	}

	/**
	 * Converts a date into a short format (DD/MM/YYYY).
	 *
	 * @param {Date | string | Timestamp} date - Date input to format.
	 * @returns {string} Formatted short date string.
	 */
	public static toShortDate(date: Date | string | Timestamp): string {
		const dt = DateTime.fromJSDate(this.resolveToDate(date));
		return dt.toFormat('dd/LL/yyyy');
	}

	/**
	 * Converts a date into an ISO-8601 string.
	 * Useful for logs, database storage, or API payloads.
	 *
	 * @param {Date | string | Timestamp} date - Date input to convert.
	 * @returns {string} ISO-8601 formatted date string.
	 */
	public static toISO(date: Date | string | Timestamp): string {
		return this.resolveToDate(date).toISOString();
	}

	/**
	 * Internal helper: normalizes a date input to a native JS Date instance.
	 *
	 * @param {Date | string | Timestamp} value - Input value to normalize.
	 * @returns {Date} Native Date object.
	 */
	private static resolveToDate(value: Date | string | Timestamp): Date {
		if (value instanceof Timestamp) return value.toDate();
		if (typeof value === 'string') return new Date(value);
		return value;
	}
}

export default FormatDate;