// @ts-check

/**
 * @typedef {Object} VisitorMeetingData
 * @property {number} [id]
 * @property {string} visitorName
 * @property {string} [visitorContact]
 * @property {string} inmateName
 * @property {string} purpose
 * @property {string} scheduledDate  // ISO date string
 * @property {string} scheduledTime  // ISO time string
 * @property {"SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"} status
 * @property {string} [remarks]
 * @property {string} [createdAt]  // ISO datetime string
 */

/** Empty object just for type import */
export const VisitorMeetingData = {};
