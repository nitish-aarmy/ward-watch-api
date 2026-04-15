import { useState, useEffect } from "react";
import { PathologyRequest } from "@/types/pathology";

const STORAGE_KEY = "bhagwati_pathology_requests";

function loadRequests(): PathologyRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRequests(requests: PathologyRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function usePathology() {
  const [requests, setRequests] = useState<PathologyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRequests(loadRequests());
    setLoading(false);
  }, []);

  const createRequest = (data: Omit<PathologyRequest, "id" | "createdAt" | "status">) => {
    const newReq: PathologyRequest = {
      ...data,
      id: `PATH-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [newReq, ...requests];
    setRequests(updated);
    saveRequests(updated);
    return newReq;
  };

  const updateRequest = (id: string, updates: Partial<PathologyRequest>) => {
    const updated = requests.map(r => r.id === id ? { ...r, ...updates } : r);
    setRequests(updated);
    saveRequests(updated);
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    saveRequests(updated);
  };

  const getRequest = (id: string) => requests.find(r => r.id === id) || null;

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
    completed: requests.filter(r => r.status === "completed").length,
    delivered: requests.filter(r => r.status === "delivered").length,
    todayCount: requests.filter(r => r.createdAt.split("T")[0] === new Date().toISOString().split("T")[0]).length,
  };

  return { requests, loading, createRequest, updateRequest, deleteRequest, getRequest, stats };
}
