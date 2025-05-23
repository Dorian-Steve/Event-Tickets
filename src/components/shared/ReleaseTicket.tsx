"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { XCircle } from "lucide-react";

function ReleaseTicket({
    eventId,
    waitingListId
} : {
    eventId: Id<"events">,
    waitingListId: Id<"waitingList">
}) {
    const [isReleasing, setIsReleasing] = useState(false);
    const releaseTicket = useMutation(api.waitingList.releaseTicket);

    const handelRelease = async () => {
        if (!confirm("Are you sure you want to release this ticket? ")) return;

        try {
            setIsReleasing(true);
            await releaseTicket ({
                eventId,
                waitingListId,
            });
        } catch (error) {
            console.error("Error releasing ticket:",error);
        } finally{
            setIsReleasing(false);
        } 
    }
  return (
    <Button onClick={handelRelease} disabled={isReleasing} className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-5 disabled:cursor-not-allowed">
        <XCircle className="w-4 h-4" />
        {isReleasing ? "Releasing...." : "Release Ticket Offer"}
    </Button>
  );
}

export default ReleaseTicket
