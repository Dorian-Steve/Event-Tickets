import {query, mutation } from  './_generated/server';
import { ConvexError, v } from 'convex/values';
import { DURATIONS, TICKET_STATUS, WAITING_LIST_STATUS } from './constant';
import { Key } from 'lucide-react';
import { internal } from './_generated/api';

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
        .query("events")
        .filter((q) => q.eq(q.field("is_cancelled"), undefined))
        .collect();
    },
});

export const getById = query({
    args: {eventId: v.id("events")},
    handler: async (ctx, {eventId}) => {
        return await ctx.db.get(eventId);
    },
});

export const getEventAvailability = query({
    args: { eventId: v.id("events") },
    handler: async (ctx, { eventId }) => {
        const event = await ctx.db.get(eventId);
        if (!event || !event.totalTickets) {
            throw new Error("Event not Found or totalTickets is undefined");
            }

        const purchasedCount = await ctx.db
            .query("tickets")
            .withIndex("by_event", (q) => q.eq("eventId", eventId))
            .collect()
            .then(
                (tickets) =>
                    tickets.filter(
                        (t) =>
                            t.status === TICKET_STATUS.VALID ||
                            t.status === TICKET_STATUS.USED
                    ).length
            );

        // Count current valid offers
        const now = Date.now();
        const activeOffers = await ctx.db
            .query("waitingList")
            .withIndex("by_event_status", (q) =>
                q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
            )
            .collect()
            .then(
                (entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
            );

        const totalReserved = purchasedCount + activeOffers;

        return {
            isSoldOut: totalReserved >= event.totalTickets,
            totalTickets: event.totalTickets,
            purchasedCount,
            remainingTickets: Math.max(0, event.totalTickets - totalReserved),
        };
    },
});

export const checkAvailability = query({
    args: { eventId: v.id("events")},
    handler: async (ctx, { eventId }) => {
        const event = await ctx.db.get(eventId);
        if (!event) throw new Error("Event not found");

        const purchaseCount = await ctx.db
        .query("tickets")
        .withIndex("by_event", (q)=>q.eq("eventId", eventId))
        .collect()
        .then(
            (tickets) => 
                tickets.filter(
                    (t) =>
                        t.status === TICKET_STATUS.VALID ||
                    t.status === TICKET_STATUS.USED
                ).length
        );

        const now = Date.now();
        const activeOffers = await ctx.db.query("waitingList")
        .withIndex("by_event_status", (q) => 
            q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
        )
        .collect()
        .then(
            (entries) => entries.filter((e) => (e.offerExpiresAt ?? 0) > now).length
        );

        const availableSpots = event.totalTickets - (purchaseCount + activeOffers);

        return {
            available : availableSpots > 0,
            availableSpots,
            totalTickets: event.totalTickets,
            purchaseCount,
            activeOffers,
        };
    },
});

// Joim waiting list for an event
export const joinWaitingList = mutation({
    //Function takes an event ID and user ID as arguments
    args: { eventId: v.id("events"), userId: v.string()},
    handler: async (ctx, { eventId, userId }) => {
        //Rate limit check
        // const status = await rateLimiter.limit(ctx, "queueJoin", {Key: userId});
        // if(!status.ok) {
        //     throw new ConvexError(
        //         `You;ve joined The waiting list too many times.Please wait ${Math.ceil(
        //             status.retryAfter / (60 * 1000)
        //         )} minutes before trying again.`
        //     );
        // }

        const existingEntry = await ctx.db.query("waitingList")
        .withIndex("by_user_event", (q) =>
            q.eq("userId", userId).eq("eventId", eventId)
        )
        .filter((q) => q.neq(q.field("status"), WAITING_LIST_STATUS.EXPIRED))
        .first();

        if(existingEntry) {
            throw new Error ("Already in waiting list for this event");
        }

        const event = await ctx.db.get(eventId);
        if (!event) throw new Error("Event not found");

        const { available } = await checkAvailability(ctx, { eventId });

        const now = Date.now();

        if (available) {
            const waitingListId = await ctx.db.insert("waitingList", {
                eventId,
                userId,
                status: WAITING_LIST_STATUS.OFFERED,
                offerExpiresAt: now + DURATIONS.TICKET_OFFER,
            });

            await ctx.scheduler.runAfter(
                DURATIONS.TICKET_OFFER,
                internal.waitingList.expireOffer,{
                    waitingListId,
                    eventId,
                }
            );
        } else {
            //if no tickets available add to waiting list
            await ctx.db.insert("waitingList", {
                eventId,
                userId,
                status: WAITING_LIST_STATUS.WAITING, // Mark as waiting
              });
        }

         // Return appropriate status message
    return {
        success: true,
        status: available
          ? WAITING_LIST_STATUS.OFFERED // If available, status is offered
          : WAITING_LIST_STATUS.WAITING, // If not available, status is waiting
        message: available
          ? `Ticket offered - you have ${DURATIONS.TICKET_OFFER / (60 * 1000)} minutes to purchase`
          : `Added to waiting list - you'll be notified when a ticket becomes available`,
      };
    },
});