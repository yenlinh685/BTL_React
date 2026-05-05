import axiosClient from "~/utils/axiosClient";
import type { MetaPagination } from "~/types/common";

export interface ContractModel {
  id: number;
  customer_id: number;
  agent_id: number;
  customer_cccd: string;
  customer_phone: string;
  post_id: number;
  amount: number | null;
  commission: number | null;
  status: "pending" | "approved" | "rejected";
  duration: "2 năm" | "5 năm" | "10 năm";
  clause: string;
  created_at: string;
  updated_at: string;
  customer?: { id: number; full_name: string; email: string; phone_number: string };
  agent?: { id: number; full_name: string; email: string; phone_number: string };
  post?: { id: number; title: string };
}

export interface ContractSummary {
  total_signed: number;
  total_amount: number;
  total_commission: number;
}

export interface GetContractsResponse {
  data: ContractModel[];
  meta: MetaPagination;
}

export const getContracts = async (params: {
  page: number;
  per_page: number;
  q?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<GetContractsResponse> => {
  const { data } = await axiosClient.get("/contracts", { params });
  return data;
};

export const getContractsSummary = async (): Promise<{ data: ContractSummary }> => {
  const { data } = await axiosClient.get("/contracts/summary");
  return data;
};

export const exportContractsCsv = async (params?: {
  q?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axiosClient.get("/contracts/export", {
    params,
    responseType: "blob",
  });
  
  // Create a blob and trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "contracts.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const createContract = async (payload: {
  customer_id: number;
  agent_id: number;
  customer_cccd: string;
  customer_phone: string;
  post_id: number;
  amount?: number;
  commission?: number;
  status?: string;
  duration?: string;
  clause: string;
}) => {
  const { data } = await axiosClient.post("/contracts", payload);
  return data;
};

export const getContractById = async (id: number) => {
  const { data } = await axiosClient.get(`/contracts/${id}`);
  return data;
};
