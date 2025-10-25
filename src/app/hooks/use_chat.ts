import { useState } from "react";
import { AnalyseLCRequest, isAnalyseLCRequest, ResumeAnalyseLCRequest } from "../models/out";
import { parseSSE } from "../tools/tools";


export type StreamEvent =
    | {
        event: "message";
        payload: string;
    }
    | {
        event: "interrupt";
        payload: { question: string; interrupt_id: string, thread_id:string };
    }
    | {
        event: "done";
        payload?: null;
    };
    

export function useChat(streamUrl: string, resumeStreamUrl:string ) {
    const [events, setEvents] = useState<StreamEvent[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectToStream = async (response: any) => {
        setIsStreaming(true);
        try {


            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop() || "";

                for (const chunk of parts) {
                        try {
                            const data: StreamEvent = parseSSE(chunk)!;
                            
                            setEvents((prev) => [...prev, data]);
                            if (data.event === "done") {
                                setIsStreaming(false);
                                return;
                            }
                        } catch {
                            console.warn("Failed to parse chunk:");
                        }
                    }
            }
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setError(err.message || "Stream error");
            }
        } finally {
            setIsStreaming(false);
        }
    };

    const sendMessage = async (request: AnalyseLCRequest | ResumeAnalyseLCRequest, isResume = false) => {
        setIsSending(true);
        setError(null);
        setEvents([]); // Clear previous events
        try {
            const url = isResume ? resumeStreamUrl : streamUrl;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setIsSending(false);
            connectToStream(response);

            return response;
        } catch (err: any) {
            const errorMessage = err.message || "Failed to send message";
            setError(errorMessage);
            setIsSending(false);
            throw new Error(errorMessage);
        }
    };

    const clearEvents = () => {
        setEvents([]);
    };

    const clearError = () => {
        setError(null);
    };

    return {
        events,
        isStreaming,
        isSending,
        error,
        sendMessage,
        clearEvents,
        clearError,
    };
}


